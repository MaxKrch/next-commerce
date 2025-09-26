"use client"

import Text from "@components/Text";
import { ProductType } from "@model/products";
import React from "react";

const DefaultCardContentSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  return (
    <Text color="primary" view="p-18" weight="bold">
      ${product.price}
    </Text>
  );
};

export default DefaultCardContentSlot;
