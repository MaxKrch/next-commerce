import clsx from 'clsx';
import useInitApp from 'hooks/useInitApp';
import React, { memo } from 'react';

import style from './Header.module.scss';
import AppLogo from './components/AppLogo';
import MainMenu from './components/MainMenu';
import UserActions from './components/UserActions';

const Header: React.FC = () => {
  useInitApp();

  return (
    <header className={clsx(style['header'])}>
      <div className={clsx(style['content-container'])}>
        <AppLogo />
        <MainMenu />
        <UserActions />
      </div>
    </header>
  );
};

export default memo(Header);
