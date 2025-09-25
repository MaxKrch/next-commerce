import { Collection } from "@model/collections";
import { ProductCategoryType } from "@model/products";
import getInitialCollection from "@store/utils/get-initial-collection";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import CategoriesApi from "@api/CategoriesApi";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import { normalizeCategoriesList } from "@store/utils/normalize-categories";

export type ICategoriesStore = {
  getCategoryById: (id: ProductCategoryType['id']) => ProductCategoryType | undefined;
};

type PrivateFields = '_list' | '_status';

export default class CategoriesStore implements ICategoriesStore {
  private _api: CategoriesApi;
  private _list: Collection<ProductCategoryType['id'], ProductCategoryType> = getInitialCollection();
  private _status: MetaStatus = META_STATUS.IDLE;
  private abortCtrl: AbortController | null = null;

  constructor(api: CategoriesApi) {
    makeObservable<CategoriesStore, PrivateFields>(this, {
      _list: observable,
      _status: observable,

      list: computed,
      status: computed,
      fetchCategories: action,
    });
    this._api = api;
  }

  get list(): ProductCategoryType[] {
    return linearizeCollection(this._list);
  }

  get status(): MetaStatus {
    return this._status;
  }

  getCategoryById(id: ProductCategoryType['id']): ProductCategoryType | undefined {
    return this._list.entities[id];
  }

  abort(): void {
    if (this.abortCtrl) {
      this.abortCtrl.abort();
      this.abortCtrl = null;
    }
  }

  async fetchCategories(): Promise<void> {
    this.abort();
    this.abortCtrl = new AbortController();

    runInAction(() => {
      this._status = META_STATUS.PENDING;
      this._list = getInitialCollection();
    });

    try {
      const response = await this._api.getCategories(this.abortCtrl.signal);

      if (response instanceof Error) {
        throw response;
      }

      const normalized = normalizeCollection(
        normalizeCategoriesList(response.data),
        (element) => element.id
      );

      runInAction(() => {
        this._list = normalized;
        this._status = META_STATUS.SUCCESS;
      });
    } catch (err) {
      runInAction(() => {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        this._list = getInitialCollection();
        this._status = META_STATUS.ERROR;
      });
    }
  }
}
