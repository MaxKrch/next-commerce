"use client"

import Button from "@components/Button";
import { ProductType } from "@model/products";
import React, { useCallback } from "react";
import { useRootStore } from "@providers/RootStoreContext";

const DefaultCardActionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();
  const handleClick = useCallback(
    (product: ProductType) => {
      cartStore.addToCart(product);
    },
    [cartStore]
  );

  return <Button onClick={() => handleClick(product)}>В корзину</Button>;
};

export default DefaultCardActionSlot;
