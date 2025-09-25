import ProductsApi from '@api/ProductsApi';
import CartApi from '@api/CartApi';
import CategoriesApi from '@api/CategoriesApi';
import CartStore from '@store/global/CartStore';
import CategoriesStore from '@store/global/CategoriesStore';
import QueryParamsStore from '@store/global/QueryParams';
import { IClient } from '@api/types';

export type RootStoreInitData = {
  client: IClient;
}

export interface IRootStore {
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly cartStore: CartStore;
  readonly api: {
    categories: CategoriesApi
    products: ProductsApi,
    cart: CartApi,
  }
};
export default class RootStore implements IRootStore {
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly cartStore: CartStore;
  readonly api: {
    categories: CategoriesApi
    cart: CartApi,
    products: ProductsApi,
  }

  constructor({
    client
  }: RootStoreInitData) {
    this.api = {
      categories: new CategoriesApi(client),
      cart: new CartApi(client),
      products: new ProductsApi(client),
    }
    this.queryParamsStore = new QueryParamsStore()
    this.categoriesStore = new CategoriesStore(this.api.categories);
    this.cartStore = new CartStore(this.api.cart);
  }
}
