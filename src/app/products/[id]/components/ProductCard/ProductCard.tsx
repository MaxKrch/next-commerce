"use client"

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import style from './ProductCard.module.scss';
import ActionSlot from './slots/ActionSlot';
import ContentSlot from './slots/ContentSlot';
import ProductDetailsStore, { ProductDetailsInitData } from '@store/local/ProductDetailsStore/ProductDetailsStore';
import { useProductDetailsStore } from '@providers/ProductDetailsStoreProvider';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { META_STATUS } from '@constants/meta-status';
import NetworkError from '@components/NetworkError';
import DefaultNetworkErrorContentSlot from '@components/NetworkError/slots/DefaultNetworkErrorContentSlot';
import DefaultNetworkErrorActionSlot from '@components/NetworkError/slots/DefaultNetworkErrorActionSlot';
import Card, { CardSkeleton } from '@components/Card';

export type ProductCardProps = {
  initData: ProductDetailsInitData

};

const ProductCard: React.FC<ProductCardProps> = ({ initData }) => {
  const productDetailsStore = useProductDetailsStore()
  const initApplied = useRef(false);
  const isFirstRender = useRef(true);
  const prevProduct = useRef<string | null>(null);
  const { id: productId } = useParams()

  const refetch = useCallback(() => {
    if(typeof productId === 'string') {
      productDetailsStore.fetchProduct(productId);
    }
  }, [productDetailsStore, productId]);

  useEffect(() => {
     if(!initApplied.current && initData && productDetailsStore.status === META_STATUS.IDLE) {
      productDetailsStore.setInitData(initData);
      prevProduct.current = initData.id;
      initApplied.current = true;
    }      
  }, [productDetailsStore, initData])


  useEffect(() => {   
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if(typeof productId !== 'string' || productId === prevProduct.current) {
      return;
    }

    prevProduct.current = productId;

    productDetailsStore.fetchProduct(productId);
  }, [productId, productDetailsStore]);

  if(productDetailsStore.error === 'NotFound' || productDetailsStore.error === 'Not Found') {
    notFound()
  }

  const isFailedRequest = productDetailsStore.status === META_STATUS.ERROR 
    || (productDetailsStore.status === META_STATUS.SUCCESS && productDetailsStore.product?.documentId !== productId);

  const isSuccessRequest = productDetailsStore.status === META_STATUS.SUCCESS 
    && !!productDetailsStore.product

  let content: ReactNode;
  switch (true) {
    case isFailedRequest: {
      content = (
        <NetworkError
          ContentSlot={DefaultNetworkErrorContentSlot}
          ActionSlot={() => <DefaultNetworkErrorActionSlot action={refetch} />}
        />
      );
      break;
    }

    case isSuccessRequest: {
      const product = productDetailsStore.product!;
      content = (
        <Card
          display="full"
          product={product}
          PriceSlot={() => <ContentSlot product={product} />}
          ActionSlot={ActionSlot}
        />
      );
      break;
    }

    default: {
      content = (<CardSkeleton display="full" />);
    }
  }

  return (
    <article className={clsx(style["product-card"])}>
      {content}
    </article>
  );
};

export default observer(ProductCard);
