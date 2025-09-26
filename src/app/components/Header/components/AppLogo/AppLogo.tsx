
import Link from 'next/link';
import style from './AppLogo.module.scss';
import { appRoutes } from '@constants/app-routes';
import clsx from 'clsx';
import React from 'react';
import LogoIcon from '@components/icons/LogoIcon';
import AppNameIcon from '@components/icons/AppNameIcon';

const AppLogo: React.FC = () => {
  return (
    <Link href={appRoutes.main.create()} className={clsx(style['logo'])}>
      <LogoIcon />
      <AppNameIcon className={clsx(style['logo__name'])} />
    </Link>
  );
};

export default AppLogo;
