import type { ProductCategoryApi } from 'types/products';
import { isStrapiSuccessResponse, type StrapiResponse } from 'types/strapi-api';
import formateError from 'utils/formate-error';

import api from './client/axios';
import { apiRoutes } from './api-routes-builder';

export type RequestArgs = {
  signal?: AbortSignal;
};
const categoryApi = {
  getCategories: async ({ signal }: RequestArgs) => {
    try {
      const response = (await api.get<StrapiResponse<ProductCategoryApi[]>>(
        apiRoutes.categories.list(),
        {
          signal: signal,
        }
      )) as unknown as StrapiResponse<ProductCategoryApi[]>;

      if (!isStrapiSuccessResponse(response)) {
        throw new Error(response.error.message);
      }
      return response;
    } catch (err) {
      return formateError(err);
    }
  },
};

export default categoryApi;
