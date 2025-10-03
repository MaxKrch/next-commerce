export const SORT_OPTIONS = {
  NEWEST: {
    key: 'NEWEST',
    label: 'Новинки',
    url: 'newest',
    api: {
      field: 'price',
      order: 'desc',
    },
  },
  POPULAR: {
    key: 'POPULAR',
    label: 'Популярные',
    url: 'popular',
    api: {
      field: 'rating',
      order: 'desc',
    },
  },
  PRICE_ASC: {
    key: 'PRICE_ASC',
    label: 'Сначала дешевле',
    url: 'price',
    api: {
      field: 'price',
      order: 'asc',
    },
  },
  PRICE_DESC: {
    key: 'PRICE_DESC',
    label: 'Сначала дороже',
    url: 'price_desc',
    api: {
      field: 'price',
      order: 'desc',
    },
  },
  DISCOUNT: {
    key: 'DISCOUNT',
    label: 'Со скидкой',
    url: 'discount',
    api: {
      field: 'discount',
      order: 'desc',
    },
  },
 } as const

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS] 
export type SortType = SortOption['key']
export const DEFAULT_SORT = SORT_OPTIONS.NEWEST.key

