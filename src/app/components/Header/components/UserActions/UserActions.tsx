import clsx from 'clsx';
import { memo } from 'react';
import style from './UserActions.module.scss';
import Link from 'next/link';
import { appRoutes } from '@constants/app-routes';
import BagIcon from '@components/icons/BagIcon';
import UserIcon from '@components/icons/UserIcon';

const UserActions = () => {
  return (
    <div className={clsx(style['actions'])}>
      <Link href={appRoutes.cart.create()}>
        <BagIcon className={clsx(style['action'])} />
      </Link>
      <Link href={appRoutes.cart.create()}>
        <UserIcon className={clsx(style['action'])} />
      </Link>
    </div>
  );
};

export default memo(UserActions);
