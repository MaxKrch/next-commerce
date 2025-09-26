import CartApi from "@api/CartApi";
import { ProductInCart, ProductInCartApi } from "@model/cart";
import { Collection } from "@model/collections";
import { ProductType } from "@model/products";
import getInitialCollection from "@store/utils/get-initial-collection";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { action, computed, makeObservable, observable, remove, runInAction } from "mobx";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import { normalizeProductInCartList } from "@store/utils/normalize-products-in-cart";

type PrivateFields =
  | '_products'
  | '_status'
  | '_setProducts'
  | '_addToCartItem'
  | '_removeFromCartItem'
  | '_error';

export default class CartStore {
  private _api: CartApi;
  private _products: Collection<ProductType['id'], ProductInCart> = getInitialCollection();
  private _abortCtrl: AbortController | null = null;
  private _status: MetaStatus = META_STATUS.IDLE;
  private _error: string | null = null;

  constructor(api: CartApi) {
    makeObservable<CartStore, PrivateFields>(this, {
      _products: observable,
      _status: observable,
      _error: observable,

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

  async addToCart(product: ProductType): Promise<void> {
    this._addToCartItem(product);
    this._error = null;

    try {
      const response = await this._api.addProduct({ product: product.id });

    } catch(err) {
      this._error = err instanceof Error ? err.message : "UnknownError"
      this._removeFromCartItem(product);
    }
  }

  async removeFromCart(product: ProductType): Promise<void> {
    this._removeFromCartItem(product);
    this._error = null;

    try {
      const response = await this._api.removeProduct({ product: product.id });

    } catch (err) {
      this._error = err instanceof Error ? err.message : "UnknownError"
      this._addToCartItem(product);
    }
  }

  private _addToCartItem(product: ProductType): void {
    const isToCart = this._products.order.includes(product.id);
    if (isToCart) {
      this._products.entities[product.id].quantity += 1;
      return;
    }

    this._products = {
      order: [...this._products.order, product.id],
      entities: { ...this._products.entities, [product.id]: { quantity: 1, product } },
    };
  }

  private _removeFromCartItem(product: ProductType): void {
    const isToCart = this._products.order.includes(product.id);

    if (!isToCart) {
      return;
    }

    const item = this._products.entities[product.id];

    if (item.quantity > 1) {
      item.quantity -= 1;
      return;
    }

    this._products.order = this._products.order.filter((item) => item !== product.id);
    this._products.entities = {
      ...this._products.entities,
    };
    remove(this._products.entities, `${product.id}`);
  }

  private _setProducts(products: ProductInCartApi[]): void {
    this._products = normalizeCollection(
      normalizeProductInCartList(products),
      (element) => element.product.id
    );
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
