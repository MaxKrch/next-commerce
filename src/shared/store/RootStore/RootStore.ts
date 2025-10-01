import ProductsApi from '@api/ProductsApi';
import CartApi from '@api/CartApi';
import CategoriesApi from '@api/CategoriesApi';
import CartStore from '@store/global/CartStore';
import CategoriesStore from '@store/global/CategoriesStore';
import QueryParamsStore from '@store/global/QueryParams';
import { IClient } from '@api/types';
import AuthApi from '@api/AuthApi';
import UserStore from '@store/global/UserStore/UserStore';

export type RootStoreInitData = {
  client: IClient;
}

export interface IRootStore {
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly userStore: UserStore;
  readonly cartStore: CartStore;
  readonly api: {
    categories: CategoriesApi
    products: ProductsApi,
    auth: AuthApi,
    cart: CartApi,
  }
};
export default class RootStore implements IRootStore {
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly userStore: UserStore;
  readonly cartStore: CartStore;
  readonly api: {
    categories: CategoriesApi,
    products: ProductsApi,
    auth: AuthApi,
    cart: CartApi,
  }

  constructor({
    client
  }: RootStoreInitData) {
    this.api = {
      categories: new CategoriesApi(client),
      products: new ProductsApi(client),
      auth: new AuthApi(client),
      cart: new CartApi(client),
    }
    this.queryParamsStore = new QueryParamsStore()
    this.categoriesStore = new CategoriesStore(this.api.categories);
    this.userStore = new UserStore(this.api.auth);
    this.cartStore = new CartStore(this.api.cart);
  }
}
