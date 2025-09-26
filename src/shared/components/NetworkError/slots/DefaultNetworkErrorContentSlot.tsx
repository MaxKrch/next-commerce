import clsx from 'clsx';
import style from '../NetworkError.module.scss';
import React from 'react';
import Text from '@components/Text';

const DefaultNetworkErrorContentSlot: React.FC = () => {
  return (
    <>
      <Text color="primary" className={clsx(style['content-slot__title'])}>
        Кажется, что-то пошло не так
      </Text>
      <Text color="primary" className={clsx(style['content-slot__body'])}>
        Попробуем снова?
      </Text>
    </>
  );
};

export default DefaultNetworkErrorContentSlot;
