import CartApi from "@api/CartApi";
import { AwaitingItem, ProductInCart, ProductInCartApi } from "@model/cart";
import { Collection } from "@model/collections";
import { ProductType } from "@model/products";
import getInitialCollection from "@store/utils/get-initial-collection";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { action, computed, makeObservable, observable, ObservableMap, remove, runInAction } from "mobx";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import { normalizeProductInCartList } from "@store/utils/normalize-products-in-cart";

type PrivateFields =
  | '_products'
  | '_status'
  | '_setProducts'
  | '_addToCartItem'
  | '_removeFromCartItem'
  | '_error'
  | '_awaitingList';

export default class CartStore {
  private _api: CartApi;
  private _products: Collection<ProductType['id'], ProductInCart> = getInitialCollection();
  private _abortCtrl: AbortController | null = null;
  private _status: MetaStatus = META_STATUS.IDLE;
  private _error: string | null = null;
  private _awaitingList: ObservableMap<ProductType['id'], AwaitingItem> = observable.map();

  constructor(api: CartApi) {
    makeObservable<CartStore, PrivateFields>(this, {
      _products: observable,
      _status: observable,
      _error: observable,
      _awaitingList: observable,

      products: computed,
      inStockProducts: computed,
      outOfStockProducts: computed,
      totalPrice: computed,
      totalItemsToOrder: computed,
      status: computed,
      error: computed,

      _addToCartItem: action,
      _removeFromCartItem: action,
      _setProducts: action,
      addToCart: action.bound,
      removeFromCart: action.bound,
      fetchCart: action.bound,
    });

    this._api = api;
  }

  get products(): ProductInCart[] {
    return linearizeCollection(this._products);
  }

  get inStockProducts(): ProductInCart[] {
    return this.products.filter((item) => item.product.isInStock);
  }

  get outOfStockProducts(): ProductInCart[] {
    return this.products.filter((item) => !item.product.isInStock);
  }

  get totalItemsToOrder(): number {
    return this.inStockProducts.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  get totalPrice(): number {
    return this.inStockProducts.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  get status(): MetaStatus {
    return this._status;
  }

  get error(): string | null {
    return this._error
  }

  private _createDebounceTimer(product: ProductType): void {
    const { id } = product;

    if(!this._awaitingList.get(id)) {
      this._awaitingList.set(id,{ 
        lastSynchQuantity: 0,
        debounce: null,
        abortCtrl: null,
      })
    }

    const targetAwaitingProduct = this._awaitingList.get(id);
    if (!targetAwaitingProduct) return;

    if(targetAwaitingProduct.debounce) {
      clearTimeout(targetAwaitingProduct.debounce)
    }

    targetAwaitingProduct.debounce = setTimeout(() => {
      this._synchWithServer(product)
    }, 1000)
  }


  getProductById(id: ProductType['id']): ProductInCart | undefined {
    return this._products.entities[id];
  }

 
  addToCart(product: ProductType): void {
    this._addToCartItem(product);
    this._createDebounceTimer(product);
  }

  removeFromCart(product: ProductType): void {
    this._removeFromCartItem(product);
    this._createDebounceTimer(product);
  }
  
  removeAllProductItems(product: ProductType): void {
    const item = this._products.entities[product.id];
    if (!item) {
      return;
    }
    this._removeFromCartItem(product, item.quantity);
    this._createDebounceTimer(product);
  }

  private _addToCartItem(product: ProductType, quantity: number = 1): void {
    const isToCart = this._products.order.includes(product.id);
    if (isToCart) {
      this._products.entities[product.id].quantity += quantity;
      return;
    }

    this._products = {
      order: [...this._products.order, product.id],
      entities: { ...this._products.entities, [product.id]: { quantity, product } },
    };
  }

  private _removeFromCartItem(product: ProductType, quantity: number = 1): void {
    const isToCart = this._products.order.includes(product.id);

    if (!isToCart) {
      return;
    }

    const item = this._products.entities[product.id];

    if (item.quantity > quantity) {
      item.quantity -= quantity;
      return;
    }

    this._products.order = this._products.order.filter((item) => item !== product.id);
    this._products.entities = {
      ...this._products.entities,
    };
    remove(this._products.entities, `${product.id}`);
  }

  private _synchWithServer = async (product: ProductType): Promise<void> => {
    const { id } = product;
    const targetAwaitingProduct = this._awaitingList.get(id);
    const targetProductInCart = this._products.entities[id];

    if(!targetAwaitingProduct) {
      return;
    }

    const change = targetProductInCart 
      ? targetProductInCart.quantity - targetAwaitingProduct.lastSynchQuantity 
      : -targetAwaitingProduct.lastSynchQuantity
    
    if(change === 0) {
      return;
    }

    if(targetAwaitingProduct.abortCtrl) {
      targetAwaitingProduct.abortCtrl.abort()
    }

    targetAwaitingProduct.abortCtrl = new AbortController();
    
    try {
      const targetMethod = change > 0
        ? this._api.addProduct
        : this._api.removeProduct

      const response = await targetMethod({ product: product.id, quantity: Math.abs(change)});
      targetAwaitingProduct.lastSynchQuantity = response.quantity ?? 0;
      targetAwaitingProduct.abortCtrl = null;

    } catch (err) {
      this._error = err instanceof Error ? err.message : "UnknownError"
      this._updateProductInCartFromServer(product, targetAwaitingProduct.lastSynchQuantity)
    }   
  }

  private _updateProductInCartFromServer(product: ProductType, quantity: number) {
    const { id } = product
    if(this._products.entities[id]) {
      this._products.entities[id].quantity = quantity;
      return;
    }

    this._products.order.push(id);
    this._products.entities = {...this._products.entities, [id]: { quantity, product }}
  }

  private _setProducts(productsObj: ProductInCartApi[]): void {
    this._products = normalizeCollection(
      normalizeProductInCartList(productsObj),
      (element) => element.product.id
    );

    runInAction(() => {
      productsObj.forEach(item => {
         this._awaitingList.set(item.product.id, {
          lastSynchQuantity: item.quantity,
          debounce: null,
          abortCtrl: null,
        });
      });
    });
  }

  async fetchCart(): Promise<void> {
    if (this._abortCtrl) {
      this._abortCtrl.abort();
    }

    this._abortCtrl = new AbortController();

    runInAction(() => {
      this._status = META_STATUS.PENDING;
      this._products = getInitialCollection();
    });

    try {
      const response = await this._api.getCart(this._abortCtrl.signal);

      runInAction(() => {
        this._abortCtrl = null;
        this._error = null;
        this._setProducts(response);
        this._status = META_STATUS.SUCCESS;
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      runInAction(() => {
        this._abortCtrl = null;
        this._error = err instanceof Error ? err.message : "UnknownError" 
        this._products = getInitialCollection();
        this._status = META_STATUS.ERROR;
      });
    }
  }
}
