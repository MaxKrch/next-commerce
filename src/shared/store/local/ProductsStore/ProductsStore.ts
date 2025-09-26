import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { Collection } from "@model/collections";
import { ProductApiType, ProductType } from "@model/products";
import { QueryParams } from "@model/query-params";
import { isStrapiSuccessResponseProducts, MetaResponse, StrapiResponseProducts } from "@model/strapi-api";
import { ILocalStore } from "@store/hooks/useLocalStore";
import RootStore from "@store/RootStore/RootStore";
import getInitialCollection from "@store/utils/get-initial-collection";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import { normalizeProductList } from "@store/utils/normalize-products";
import { action, computed, IReactionDisposer, makeObservable, observable, reaction, runInAction } from "mobx";

type PrivateFields = 
    | '_products' 
    | '_status' 
    | '_meta' 
    | '_error'
    | '_requestId' 
    | '_setProducts';

export type ProductInitData = {
    success: true,
    products: ProductApiType[],
    query: string,
    meta: MetaResponse<ProductApiType[]>
} | {
    success: false,
    query: string,
    error: string,
}

export default class ProductsStore implements ILocalStore {
  private _products: Collection<ProductType['id'], ProductType> = getInitialCollection();
  private _meta: MetaResponse<ProductType[]> | null = null;
  private _status: MetaStatus = META_STATUS.IDLE;
  private _requestId: string | undefined = undefined;
  private _abortCtrl: AbortController | null = null;
  private _rootStore: RootStore;
  private _error: string | null = null;
  reactions: IReactionDisposer[]

  constructor({
    rootStore
  }: {
    rootStore: RootStore 
  }) {
    makeObservable<ProductsStore, PrivateFields>(this, {
      _products: observable,
      _status: observable,
      _meta: observable,
      _requestId: observable,
      _error: observable,

      products: computed,
      status: computed,
      pagination: computed,
      requestId: computed,
      countProducts: computed,
      error: computed,

      fetchProducts: action.bound,
      resetProductList: action.bound,
      setInitData: action.bound,
      _setProducts: action,
    });

    this._rootStore = rootStore;
    this.reactions = [];
    this.initReactions();
  }

  initReactions(): void {
      
  }

  get products(): ProductType[] {
    return linearizeCollection(this._products);
  }

  get status(): MetaStatus {
    return this._status;
  }

  get error(): string | null {
    return this._error;
  }

  get requestId(): string | undefined {
    return this._requestId;
  }

  get pagination(): MetaResponse<ProductType[]>['pagination'] | undefined {
    return this._meta?.pagination;
  }

  get countProducts(): number {
    return this._products.order.length;
  }

  private _setProducts(products: ProductApiType[] | null) {
    if (!products) {
      this._products = getInitialCollection();
      return;
    }

    this._products = normalizeCollection(
        normalizeProductList(products), 
        (product) => product.id
    );
  }

  setInitData = (init: ProductInitData): void => {
    if(!init.success) {
        this._status = META_STATUS.ERROR;
        this._error = init.error;
        return;
    }

    this._setProducts(init.products);
    this._meta = init.meta;
    this._status = META_STATUS.SUCCESS;
  }

  getProductbyId(id: ProductType['id']): ProductType | undefined {
    return this._products.entities[id];
  }

  resetProductList(): void {
    this._products = getInitialCollection();
    this._meta = null;
    this._requestId = undefined;
    this._status = META_STATUS.IDLE;
  }

  async fetchProducts(params: QueryParams, requestId?: string): Promise<void> {
    if (this._abortCtrl) {
      this._abortCtrl.abort();
    }
    this._abortCtrl = new AbortController();

    runInAction(() => {
      this._status = META_STATUS.PENDING;
      this._requestId = requestId;
      this._meta = null;
      this._error = null;
      this._setProducts(null);
    });

    try {
      const response = await this._rootStore.api.products.getProductList(
        params,
        this._abortCtrl.signal,
      );

      runInAction(() => {
        this._meta = response.meta;
        this._setProducts(response.data);
        this._abortCtrl = null;
        this._status = META_STATUS.SUCCESS;
      });

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      runInAction(() => {
        this._meta = null;
        this._requestId = undefined;
        this._error = err instanceof Error ? err.message : "UnknownError" 
        this._setProducts(null);
        this._status = META_STATUS.ERROR;
      });
    }
  }

  clearReactions(): void {      
  }

  destroy(): void {      
  }
}
