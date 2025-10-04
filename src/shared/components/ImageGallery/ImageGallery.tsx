import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import style from './ImageGallery.module.scss'
import { ProductType } from '@model/products';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import CrossIcon from '@components/icons/CrossIcon';
import ArrowRightIcon from '@components/icons/ArrowRightIcon';

export type ImageGalleryProps = {
  images: ProductType['images'];
  sizes: string
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, sizes }) => {
  const [mode, setMode] = useState<'preview' | 'full'>('preview');
  const [index, setIndex] = useState(0);

  const handleClickImg = useCallback(() => {
    setMode(mode === 'preview' ? 'full' : 'preview')
  }, [mode]);

  const handleClickLeftArrow = useCallback(() => {
    const nextIndex = index === 0 
      ? images.length - 1 
      : index - 1
    setIndex(nextIndex)
  }, [index])

  const handleClickRightArrow = useCallback(() => {
    const nextIndex = index + 1 < images.length
      ? index + 1
      : 0
      setIndex(nextIndex)
  }, [index])

  const handleClickCross = useCallback(() => {
    setMode('preview')
  }, [mode])

  return (
    <div className={clsx(style['gallery'], style[`gallery_${mode}`])}>
      {mode === 'full' &&
        <div className={clsx(style['gallery__cross-container'])} onClick={handleClickCross}>
          <CrossIcon className={clsx(style['gallery__cross'])}/>
        </div>
      }

      <div
        onClick={handleClickLeftArrow} 
        className={clsx(
          style['gallery__arrow-container'], 
          style['gallery__arrow-container_left'], 
          style[`gallery__arrow-container_${mode}`]
        )}
      >
        <ArrowRightIcon  className={clsx(style['gallery__arrow'], style['gallery__arrow_left'])}/>
      </div>

      <div 
        onClick={handleClickRightArrow}
        className={clsx(
          style['gallery__arrow-container'], 
          style['gallery__arrow-container_right'], 
          style[`gallery__arrow-container_${mode}`]
        )}
      >
        <ArrowRightIcon  className={clsx(style['gallery__arrow'], style['gallery__arrow_right'])}/>
      </div>

      {mode === 'full' &&
        <div
          className={clsx(style['gallery__bg'])} 
          style={{
            background: `url(${images[index].url})`
          }} 
        />
      }
      <div className={clsx(style['gallery__image-container'])} onClick={handleClickImg}>
        {
          images.map((img, currentIndex) => (
            <Image
              key={img.id}
              className={clsx(
                style['gallery__image'], 
                style[`gallery__image_${mode}`], 
                currentIndex === index && style['gallery__image_active']
              )}
              src={img.url}
              alt={img.alternativeText ?? 'Card Image'}
              fill
              sizes={mode === 'preview' ? sizes : '100vh'}
              priority
            />
          ))
        }
      </div>

      
    </div>
  );
};

export default observer(ImageGallery);
