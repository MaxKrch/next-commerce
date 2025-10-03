"use client"

import clsx from 'clsx';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import style from './UserActions.module.scss';
import Link from 'next/link';
import { appRoutes } from '@constants/app-routes';
import BagIcon from '@components/icons/BagIcon';
import UserIcon from '@components/icons/UserIcon';
import { useRootStore } from '@providers/RootStoreContext';
import { META_STATUS } from '@constants/meta-status';
import Text from '@components/Text';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { MODES } from '@constants/modal';

const UserActions = () => {
  const path = usePathname()
  const { 
    cartStore,
    userStore,
    modalStore 
  } = useRootStore();

  const CartComponent: React.FC<PropsWithChildren> = path === appRoutes.cart.mask
    ? ({ children }) => <p>{children}</p>
    : ({ children }) => <Link href={appRoutes.cart.create()}>{children}</Link>

  const handleUserIconClick = useCallback(() => {
     const mode = userStore.isAuthorized ? MODES.PROFILE : MODES.AUTH;
    modalStore.open(mode)
  }, [userStore.isAuthorized]);  

  return (
    <div className={clsx(style['actions'])}>
      <div className={clsx(
        style['actions-cart'], 
        style['actions__item'], 
        path === appRoutes.cart.mask && style['actions__item_active']
      )}>
        <CartComponent>
          <BagIcon className={clsx(style['actions__icon'])} />
        </CartComponent>
        {cartStore.totalItemsToOrder > 0 &&
          <Text weight='bold' className={clsx(style['actions-cart__count'])}>
            {cartStore.totalItemsToOrder}
          </Text>
        }
      </div>
      <div onClick={handleUserIconClick} className={clsx(style['actions__item'])}>
        <UserIcon className={clsx(style['actions__icon'])} />
      </div>
    </div>
  );
};

export default observer(UserActions);
