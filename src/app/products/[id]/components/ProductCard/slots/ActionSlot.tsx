import clsx from 'clsx';
import React, { memo, useCallback } from 'react';
import style from '../ProductCard.module.scss';
import { ProductType } from '@model/products';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@constants/app-routes';
import Button from '@components/Button';
import { useRootStore } from '@providers/RootStoreContext';

const ActionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();
  const router = useRouter()

  const handleSecondBtn = useCallback(
    (product: ProductType) => {
      cartStore.addToCart(product);
    },
    [cartStore]
  );

  const handlePrimaryBtn = useCallback(
    (product: ProductType) => {
      cartStore.addToCart(product);
      router.push(appRoutes.cart.create());
    },
    [cartStore, router]
  );

  return (
    <div className={clsx(style['action-slot'])}>
      <Button onClick={() => handlePrimaryBtn(product)}>Купить</Button>
      <Button priority="secondary" onClick={() => handleSecondBtn(product)}>
        В корзину
      </Button>
    </div>
  );
};

export default memo(ActionSlot);
