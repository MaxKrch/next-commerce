"use client"
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import style from './RelatedProducts.module.scss';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useProductsStore } from '@providers/ProductsStoreProvider';
import { useProductDetailsStore } from '@providers/ProductDetailsStoreProvider';
import { useParams } from 'next/navigation';
import { ProductsInitData } from '@store/local/ProductsStore/ProductsStore';
import { META_STATUS } from '@constants/meta-status';
import Text from '@components/Text';
import CardList from '@components/CardList';
import CardListSkeleton from '@components/CardList/CardListSkeleton';
import NetworkError from '@components/NetworkError';
import DefaultNetworkErrorContentSlot from '@components/NetworkError/slots/DefaultNetworkErrorContentSlot';
import DefaultNetworkErrorActionSlot from '@components/NetworkError/slots/DefaultNetworkErrorActionSlot';
import DefaultCardCaptionSlot from '@components/Card/slots/DefaultCardCaptionSlot';
import DefaultCardPriceSlot from '@components/Card/slots/DefaultCardPriceSlot';
import DefaultCardActionSlot from '@components/Card/slots/DefaultCardActionSlot';

export type RelatedProductsProps = {
  initData: ProductsInitData
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ initData }) => {
  const productDetailsStore = useProductDetailsStore();
  const productsStore = useProductsStore();
  const initApplied = useRef(false);
  const isFirstRender = useRef(true);
  const prevProduct = useRef<string | null>(null);
  const { id: productId } = useParams();

  const refetch = useCallback(() => {
    const currentProduct = productDetailsStore.product;

    if(currentProduct) {
      productsStore.fetchProducts({
        categories: [currentProduct.productCategory.id],
      })
    }
  }, [productsStore, productDetailsStore.product]);
  
  useEffect(() => {
    if(!initApplied.current && initData && productsStore.status === META_STATUS.IDLE) {
      productsStore.setInitData(initData);
      prevProduct.current = initData.query;
      initApplied.current = true;
    }      
  }, [productsStore, initData])
  
  useEffect(() => {   
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  
    if(productDetailsStore.status === META_STATUS.PENDING) {
      let productCategory: number[] = [];
      
      if(typeof productId === 'string') {
        const targetProduct = productsStore.findProductByDocumentId(productId)
      
        if(targetProduct) {
          productCategory = [targetProduct.productCategory.id]
        }
      }
       
      productsStore.fetchProducts({
        categories: productCategory
      })
    }
  }, [productId, productsStore, productDetailsStore, productDetailsStore.status]);

  const isFailedRequest = productsStore.status === META_STATUS.ERROR 
    || (productsStore.status === META_STATUS.SUCCESS && productDetailsStore.product?.documentId !== prevProduct.current)

  const notFoundProducts = productsStore.status === META_STATUS.SUCCESS && productsStore.products.length === 0

  const showRelatedProducts = productsStore.status === META_STATUS.SUCCESS 
    && productDetailsStore.status === META_STATUS.SUCCESS 
    && productDetailsStore.product?.documentId === prevProduct.current
    

  let content: ReactNode
  switch(true) {
    case isFailedRequest: {
      content = (
        <NetworkError
          ContentSlot={DefaultNetworkErrorContentSlot}
          ActionSlot={() => <DefaultNetworkErrorActionSlot action={refetch} />}
        />
      )
      break;
    }

    case notFoundProducts: {
      content = (
        <Text>
          Похожие товары не найдены, похоже - это что-то уникальное
        </Text>
      )
      break;
    }

    case showRelatedProducts: {
      content =(
        <CardList
          display="preview"
          products={productsStore.products}
          CaptionSlot={DefaultCardCaptionSlot}
          PriceSlot={DefaultCardPriceSlot}
          ActionSlot={DefaultCardActionSlot}
          className={clsx(style['related-products'])}
        />
      )
      break;
    }

    default: {
      content = (
        <CardListSkeleton  
          display="preview"
          skeletonCount={6}
          className={clsx(style['related-products'])}
        />
      )
    }
  }

  return (
    <div className={clsx(style['related-products__container'])}>
      {!isFailedRequest &&
        <Text color="primary" weight="bold" className={clsx(style['related-products__title'])}>
          Вам понравится
        </Text>
      }
      {content}
    </div>
  );
};

export default observer(RelatedProducts);