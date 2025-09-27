import clsx from 'clsx';
import React from 'react';

import style from './Skeleton.module.scss';

const Skeleton: React.FC = () => {
  return (
    <div className={clsx(style['list'])}>
      <div className={clsx(style['list-card'])}>
        <div className={clsx(style['list-card-img'])} />
        <div className={clsx(style['list-card-content'])}>
          <div className={clsx(style['list-card-content-title'])} />
          <div className={clsx(style['list-card-content-description'])} />
          <div className={clsx(style['list-card-content-button'])} />
        </div>
      </div>

      <div className={clsx(style['list-card'])}>
        <div className={clsx(style['list-card-img'])} />
        <div className={clsx(style['list-card-content'])}>
          <div className={clsx(style['list-card-content-title'])} />
          <div className={clsx(style['list-card-content-description'])} />
          <div className={clsx(style['list-card-content-button'])} />
        </div>
      </div>

      <div className={clsx(style['summary'])}>
        <div className={clsx(style['summary-body'])}>
          <div className={clsx(style['summary-body-title'])} />
          <div className={clsx(style['summary-body-content'])} />
          <div className={clsx(style['summary-body-content'])} />
          <div className={clsx(style['summary-body-button'])} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
