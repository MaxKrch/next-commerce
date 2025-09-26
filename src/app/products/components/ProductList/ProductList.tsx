"use client"
import { clsx } from 'clsx';
import CardList from '@components/CardList';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import style from './ProductList.module.scss';
import { CardListProps } from '@components/CardList/CardList';
import { ProductInitData } from '@store/local/ProductsStore/ProductsStore';
import { useProductsStore } from 'src/app/providers/ProductsStoreProvider';
import { META_STATUS } from '@constants/meta-status';
import { useRootStore } from 'src/app/providers/RootStoreContext';
import { notFound } from 'next/navigation';
import NetworkError from '@components/NetworkError';
import DefaultNetworkErrorContentSlot from '@components/NetworkError/slots/DefaultNetworkErrorContentSlot';
import DefaultNetworkErrorActionSlot from '@components/NetworkError/slots/DefaultNetworkErrorActionSlot';
import CardListSkeleton from '@components/CardList/CardListSkeleton';
import Text from '@components/Text';
import DefaultCardCaptionSlot from '@components/Card/slots/DefaultCardCaptionSlot';
import DefaultCardPriceSlot from '@components/Card/slots/DefaultCardPriceSlot';
import DefaultCardActionSlot from '@components/Card/slots/DefaultCardActionSlot';


export type ProductListprops = {
  initData: ProductInitData
}
const ProductList: React.FC<ProductListprops> = ({initData}) => {
  const initApplied = useRef(false);
  const isFirstRender = useRef(true);
  const prevQueryString = useRef<string | null>(null);
  const requestId = useRef<string | null>(null);
  const productsStore = useProductsStore();
  const { queryParamsStore } = useRootStore()
  
  const refetch = useCallback(() => {
    productsStore.fetchProducts({
      ...queryParamsStore.queryObject,
      count: 9,
    });
  }, [productsStore, queryParamsStore]);

  useEffect(() => {
     if(!initApplied.current && initData && productsStore.status === META_STATUS.IDLE) {
      productsStore.setInitData(initData);
      prevQueryString.current = initData.query;
      initApplied.current = true;
    }
      
  }, [productsStore, initData])


  useEffect(() => {
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const nextQueryString = queryParamsStore.queryString;
    if (nextQueryString === prevQueryString.current) {
      return;
    } 
    console.log(5)
    const id = crypto.randomUUID();
    requestId.current = id;
    prevQueryString.current = nextQueryString;

    productsStore.fetchProducts(
      {
        ...queryParamsStore.queryObject,
        count: 9,
      },
      id
    );
  }, [queryParamsStore.queryString, productsStore]);

  if(productsStore.error === 'NotFound' || productsStore.error === 'Not Found') {
    notFound()
  }

  const isFailedRequest = productsStore.status === META_STATUS.ERROR ||
    (productsStore.status === META_STATUS.SUCCESS && requestId.current && productsStore.requestId !== requestId.current);

  if(isFailedRequest) {
    return(
      <NetworkError
        ContentSlot={DefaultNetworkErrorContentSlot} 
        ActionSlot={() => <DefaultNetworkErrorActionSlot action={refetch}/>} 
      />
    )
  }

  return (
    <div className={clsx(style['product-list'])}>
      <div className={clsx(style['product-list-title'])}>
        <Text color="primary" weight="bold" className={clsx(style['product-list-count__name'])}>
          Найдено товаров
        </Text>
        <Text view="p-20" color="secondary" className={clsx(style['product-list-count__size'])}>
          {productsStore.pagination?.total}
        </Text>
      </div>
      {productsStore.status === META_STATUS.SUCCESS ? (
        <CardList
          display="preview"
          products={productsStore.products}
          CaptionSlot={DefaultCardCaptionSlot}
          PriceSlot={DefaultCardPriceSlot}
          ActionSlot={DefaultCardActionSlot}
        />
      ) : (
        <CardListSkeleton skeletonCount={6} display="preview" />
      )}
    </div>
  );
};

export default observer(ProductList);
