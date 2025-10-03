"use client"

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import style from './Cart.module.scss';
import CartSummary from './components/CartSummary';
import CartProducts from './components/CartProducts';
import Skeleton from './components/Skeleton';
import { useRootStore } from '@providers/RootStoreContext';
import { META_STATUS } from '@constants/meta-status';
import { useEffect, useRef } from 'react';
import NetworkError from '@components/NetworkError';
import DefaultNetworkErrorContentSlot from '@components/NetworkError/slots/DefaultNetworkErrorContentSlot';
import DefaultNetworkErrorActionSlot from '@components/NetworkError/slots/DefaultNetworkErrorActionSlot';
import OnlyClient from '@components/OnlyClient';
import { useRouter } from 'next/navigation';
import Loader from '@components/Loader';
import { MODES } from '@constants/modal';
import { appRoutes } from '@constants/app-routes';
import PrivateRoute from '@components/PrivateRoute';

const CartPage: React.FC = () => {
  const router = useRouter()
  const { cartStore, userStore, modalStore } = useRootStore();
  const debouncer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
      if(cartStore.status !== META_STATUS.PENDING && !debouncer.current && userStore.isAuthorized) {
        cartStore.fetchCart();
        debouncer.current = setTimeout(() => debouncer.current === null, 60 * 1000)
      }
  }, [cartStore, cartStore.status, userStore.isAuthorized])


  return (
    <PrivateRoute>
      <div className={clsx(style['cart'])}>
        {(cartStore.status === META_STATUS.PENDING || cartStore.status === META_STATUS.IDLE) && (
          <Skeleton />
        )}
        {cartStore.status === META_STATUS.ERROR && (
          <NetworkError
            ContentSlot={DefaultNetworkErrorContentSlot}
            ActionSlot={() => <DefaultNetworkErrorActionSlot action={cartStore.fetchCart} />}
          />
        )}
        {cartStore.status === META_STATUS.SUCCESS && (
          <>
            <CartProducts className={clsx(style['cart-products'])} />
            <CartSummary className={clsx(style['cart-summary'])}/> 
          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default observer(CartPage);

