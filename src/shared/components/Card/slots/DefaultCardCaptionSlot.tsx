"use client"

import Text from "@components/Text";
import { ProductType } from "@model/products";
import React from "react";

const DefaultCardCaptionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  return (
    <Text color="secondary" weight="bold">
      {product.productCategory.title}
    </Text>
  );
};

export default DefaultCardCaptionSlot;
