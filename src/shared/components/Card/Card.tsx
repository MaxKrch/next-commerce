import clsx from 'clsx';
import React, { memo } from 'react';
import style from './Card.module.scss';
import ImageGalery from './components/ImageGalery';
import { ProductType } from '@model/products';
import Link from 'next/link';
import { appRoutes } from '@constants/app-routes';
import Text from '@components/Text';
import Image from 'next/image';
import getCardImageSizes from './utils/get-card-image-sizes';

export type CardProps = {
  display?: 'full' | 'preview' | 'cart';
  product: ProductType;
  className?: string;
  CaptionSlot?: React.ComponentType<{product: ProductType}>;
  PriceSlot?: React.ComponentType<{product: ProductType}>;
  ActionSlot?: React.ComponentType<{product: ProductType}>;
};

const Card: React.FC<CardProps> = ({
  display = 'preview',
  product,
  CaptionSlot,
  PriceSlot,
  ActionSlot,
  className,
}) => {
  const { images, description, title } = product;
  const href = appRoutes.products.details.create(product.documentId);
  const imageSizes = getCardImageSizes(display);

  return (
    <article className={clsx(style['card'], style[display], className)}>
      <div className={clsx(style['card__image-wrapper'], style[`${display}__image-wrapper`])}>      
        {display === 'full' ? (
          <ImageGalery images={images} sizes={imageSizes} />
        ) : (
          <Link href={href} className={clsx(style['card__image-link'])}>
            <Image
              className={clsx(style['card__image'])}
              src={images[0].url}
              alt={title ? title.toString() : 'Card image'}
              sizes={imageSizes}
              fill
            />
          </Link>
        )}
      </div>

      <main className={clsx(style['card__main'], style[`${display}__main`])}>
        {CaptionSlot && (
          <div className={clsx(style[`${display}__caption-slot`])}>
            <CaptionSlot product={product} />
          </div>
        )}
        
        <Link href={href}>
          <Text
            maxLines={2}
            tag="h3"
            weight="bold"
            color="primary"
            className={clsx(style[`${display}__title`])}
          >
            {title}
          </Text>

          {display !== 'cart' && (
            <Text
              maxLines={3}
              weight="normal"
              color="secondary"
              className={clsx(style[`${display}__description`])}
            >
              {description}
            </Text>
          )}
        </Link>
      </main>

      <footer className={clsx(style[`${display}__footer`])}>
        <div className={clsx(style[`${display}__content-slot`])}>
          {PriceSlot && <PriceSlot product={product} />}
        </div>

        <div className={clsx(style[`${display}__action-slot`])}>
          {ActionSlot && <ActionSlot product={product} />}
        </div>
      </footer>
    </article>
  );
};

export default memo(Card);
