"use client"

import Text from "@components/Text";
import { ProductType } from "@model/products";
import clsx from "clsx";
import React from "react";
import style from '../Card.module.scss'

const DefaultCardPriceSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  return (
    <Text color="primary" className={clsx(style['price-slot'])} weight="bold">
      ${product.price}
    </Text>
  );
};

export default DefaultCardPriceSlot;
