import type { ProductInCartApi } from 'types/cart';
import type { Product } from 'types/products';
import { type StrapiResponseCart, isStrapiSuccessResponseCart } from 'types/strapi-api';
import formateError from 'utils/formate-error';

import api, { type AuthRequestConfig } from './client/axios';
import { apiRoutes } from './api-routes-builder';

export type RequestCartArgs = {
  product: Product['id'];
  quantity?: number;
  signal?: AbortSignal;
};

const cartApi = {
  getCart: async ({ signal }: { signal?: AbortSignal }) => {
    try {
      const response = (await api.get<StrapiResponseCart<ProductInCartApi[]>>(
        apiRoutes.cart.details(),
        {
          signal,
          requiredAuth: true,
        } as AuthRequestConfig
      )) as unknown as StrapiResponseCart<ProductInCartApi[]>;

      if (!isStrapiSuccessResponseCart<ProductInCartApi[]>(response)) {
        throw new Error(response.error.message);
      }
      return response;
    } catch (err) {
      return formateError(err);
    }
  },
  addProduct: async ({ product, quantity = 1, signal }: RequestCartArgs) => {
    try {
      const response = (await api.post<StrapiResponseCart<ProductInCartApi>>(
        apiRoutes.cart.add(),
        {
          product,
          quantity,
        },
        {
          signal,
          requiredAuth: true,
        } as AuthRequestConfig
      )) as unknown as StrapiResponseCart<ProductInCartApi>;

      if (!isStrapiSuccessResponseCart<ProductInCartApi>(response)) {
        throw new Error(response.error.message);
      }

      return response;
    } catch (err) {
      return formateError(err);
    }
  },
  removeProduct: async ({ product, quantity = 1, signal }: RequestCartArgs) => {
    try {
      const response = (await api.post<StrapiResponseCart<ProductInCartApi>>(
        apiRoutes.cart.remove(),
        {
          product,
          quantity,
        },
        {
          signal,
          requiredAuth: true,
        } as AuthRequestConfig
      )) as unknown as StrapiResponseCart<ProductInCartApi>;

      if (!isStrapiSuccessResponseCart<ProductInCartApi>(response)) {
        throw new Error(response.error.message);
      }

      return response;
    } catch (err) {
      return formateError(err);
    }
  },
};

export default cartApi;
