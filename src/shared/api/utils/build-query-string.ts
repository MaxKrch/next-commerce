import qs from 'qs';
import { QueryParams } from '@/shared/types/query-params';

type buildQueryStringArgs = QueryParams & {
  populate?: string[] | string | object;
};

export function buildQueryString(params: buildQueryStringArgs) {
  const { page = 1, count = 25, query, categories, populate } = params;

  const strapiQuery: Record<string, unknown> = {
    pagination: {
      page,
      pageSize: count,
    },
  };

  if (populate) {
    strapiQuery.populate = populate;
  }

  if (query) {
    strapiQuery.filters = {
      ...(strapiQuery.filters || {}),
      title: { $containsi: query },
    };
  }

  if (Array.isArray(categories)) {
    strapiQuery.filters = {
      ...(strapiQuery.filters || {}),
      productCategory: {
        id: { $in: categories },
      },
    };
  }

  return qs.stringify(strapiQuery);
}
