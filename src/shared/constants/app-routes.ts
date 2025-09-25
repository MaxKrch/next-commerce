import { ProductType } from "@/shared/types/products";

export const appRoutes = {
  main: {
    mask: '/',
    create: () => '/',
  },
  products: {
    list: {
      mask: '/products',
      create: () => '/products',
    },
    details: {
      mask: '/products/:id',
      create: (id: ProductType['documentId']) => `/products/${id}`,
    },
  },
  categories: {
    mask: '/categories',
    create: () => '/categories',
  },
  cart: {
    mask: '/cart',
    create: () => '/cart',
  },
  my: {
    mask: '/my',
    create: () => '/my',
  },
  about: {
    mask: '/about',
    create: () => '/about',
  },
} as const;
