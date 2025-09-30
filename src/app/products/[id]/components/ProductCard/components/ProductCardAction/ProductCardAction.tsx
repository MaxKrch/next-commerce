import clsx from 'clsx';
import React, { useCallback } from 'react';
import style from './ProductCardAction.module.scss'
import { ProductType } from '@model/products';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@constants/app-routes';
import Button from '@components/Button';
import { useRootStore } from '@providers/RootStoreContext';
import { observer } from 'mobx-react-lite';
import DefaultCardActionSlot from '@components/Card/slots/DefaultCardActionSlot';

const ProductCardAction: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();
  const router = useRouter()

  const handlePrimaryBtn = useCallback(
    (product: ProductType) => {
      cartStore.addToCart(product);
      router.push(appRoutes.cart.create());
    },
    [cartStore, router]
  );

  return (
    <>
      <Button className={clsx(style['action__button'])} onClick={() => handlePrimaryBtn(product)}>Купить</Button>
      <DefaultCardActionSlot priority="secondary" product={product}/>
    </>
  );
};

export default observer(ProductCardAction);
