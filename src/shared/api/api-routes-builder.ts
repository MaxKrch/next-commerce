import type { QueryParams } from 'types/query-params';

import { buildQueryString } from './utils/build-query-string';

const populate = {
  products: ['images', 'productCategory'],
  categories: ['image'],
} as const;

export const apiRoutes = {
  categories: {
    list: () => {
      const queryString = buildQueryString({
        populate: populate['categories'],
      });

      return `/product-categories?${queryString}`;
    },
  },
  products: {
    list: (args: QueryParams) => {
      const queryString = buildQueryString({
        ...args,
        populate: populate['products'],
      });

      return `/products?${queryString}`;
    },

    details: ({ id }: { id: string }) => {
      const queryString = buildQueryString({ populate: populate['products'] });

      return `/products/${id}?${queryString}`;
    },
  },
  cart: {
    details: () => {
      return `/cart`;
    },
    add: () => {
      return `/cart/add`;
    },
    remove: () => {
      return `/cart/remove`;
    },
  },
} as const;
