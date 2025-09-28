import { SortType } from "@constants/product-sort";

export type QueryParams = Partial<{
  page: number;
  count: number;
  categories: number[];
  query: string;
  sort: SortType;
  inStock: boolean;
}>
