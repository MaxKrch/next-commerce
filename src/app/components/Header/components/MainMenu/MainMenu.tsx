import AppMenu from 'constants/app-menu';

import clsx from 'clsx';
import Text from 'components/Text';
import { memo } from 'react';
import { NavLink } from 'react-router-dom';

import style from './MainMenu.module.scss';

const MainMenu = () => {
  const classes = ({ isActive }: { isActive: boolean }) =>
    clsx({
      [style.link]: true,
      [style.active]: isActive,
    });

  return (
    <nav className={clsx(style['menu'])}>
      {AppMenu.map((item) => (
        <NavLink key={item.path} to={item.path} className={classes} end>
          <Text weight="bold" className={clsx(style['link-text'])}>
            {item.title}
          </Text>
        </NavLink>
      ))}
    </nav>
  );
};

export default memo(MainMenu);
