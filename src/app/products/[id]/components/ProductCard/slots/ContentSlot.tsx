import clsx from 'clsx';
import type React from 'react';
import style from '../ProductCard.module.scss';
import { ProductType } from '@model/products';
import Text from '@components/Text';
import { memo } from 'react';

const ContentSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  return (
    <Text weight="bold" className={clsx(style['content-slot'])}>
      ${product.price}
    </Text>
  );
};

export default memo(ContentSlot);
