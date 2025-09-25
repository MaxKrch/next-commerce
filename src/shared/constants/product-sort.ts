export const SORT_OPTIONS = {
  NEWEST: 'newest',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  DISCOUNT: 'discount_size'
} as const;

export type SortType = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS]