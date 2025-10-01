"use client"

import Text from "@components/Text";
import { ProductType } from "@model/products";
import clsx from "clsx";
import React, { memo } from "react";

const DefaultCardCaptionSlot: React.FC<{ product: ProductType, className?: string }> = ({ product, className }) => {
  return (
    <Text color="secondary" weight="bold" className={clsx(className)}>
      {product.productCategory.title}
    </Text>
  );
};

export default memo(DefaultCardCaptionSlot);
