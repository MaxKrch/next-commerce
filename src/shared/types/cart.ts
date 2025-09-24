import type { Product, ProductApi } from './products';

export type ProductInCartApi = {
  id: number;
  documentId: string;
  originalProductId: number;
  product: ProductApi;
  quantity: number;
};
export type ProductInCart = {
  product: Product;
  quantity: number;
};

export type AwaitingSynchProduct = Record<
  Product['id'],
  {
    lastSynchQuantity: number;
    debounce: ReturnType<typeof setTimeout> | null;
  }
>;
