import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import style from './ImageGalery.module.scss';
import { ProductType } from '@model/products';
import Image from 'next/image';

export type ImageGaleryProps = {
  images: ProductType['images'];
  sizes: string
};

const ImageGalery = ({ images, sizes }: ImageGaleryProps) => {
  return (
    <Image
      className={clsx(style['card__image'])}
      src={images[0]?.url}
      alt={images[0]?.alternativeText ?? 'Card Image'}
      fill
      sizes={sizes}
    />
  );
};

export default observer(ImageGalery);
