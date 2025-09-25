import type { ProductType, ProductApiType } from './products';

export type ProductInCartApi = {
  id: number;
  documentId: string;
  originalProductId: number;
  product: ProductApiType;
  quantity: number;
};
export type ProductInCart = {
  product: ProductType;
  quantity: number;
};

export type AwaitingSynchProduct = Record<
  ProductType['id'],
  {
    lastSynchQuantity: number;
    debounce: ReturnType<typeof setTimeout> | null;
  }
>;
