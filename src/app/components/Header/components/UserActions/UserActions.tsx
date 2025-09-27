"use client"

import clsx from 'clsx';
import { useEffect } from 'react';
import style from './UserActions.module.scss';
import Link from 'next/link';
import { appRoutes } from '@constants/app-routes';
import BagIcon from '@components/icons/BagIcon';
import UserIcon from '@components/icons/UserIcon';
import { useRootStore } from '@providers/RootStoreContext';
import { META_STATUS } from '@constants/meta-status';
import Text from '@components/Text';
import { observer } from 'mobx-react-lite';

const UserActions = () => {
  const { cartStore } = useRootStore();
  useEffect(() => {
    if(cartStore.status === META_STATUS.IDLE) {
      cartStore.fetchCart()
    }
  }, [cartStore])

  return (
    <div className={clsx(style['actions'])}>
      <div className={clsx(style['actions-cart'])}>
        <Link href={appRoutes.cart.create()}>
          <BagIcon className={clsx(style['actions__icon'])} />
        </Link>
        {cartStore.totalItemsToOrder > 0 &&
          <Text weight='bold' view='p-14' className={clsx(style['actions-cart__count'])}>
            {cartStore.totalItemsToOrder}
          </Text>
        }
      </div>
      <Link href={appRoutes.cart.create()}>
        <UserIcon className={clsx(style['actions__icon'])} />
      </Link>
    </div>
  );
};

export default observer(UserActions);
