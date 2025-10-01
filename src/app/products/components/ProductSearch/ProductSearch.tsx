"use client"

import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import style from './ProductSearch.module.scss';
import CrossIcon from '@components/icons/CrossIcon';
import Button from '@components/Button';
import Input from '@components/Input';
import useSearchStore from '@store/local/SearchStore/useSearchStore';
import { META_STATUS } from '@constants/meta-status';
import SearchIcon from '@components/icons/SearchIcon';
import MultiDropdown from '@components/MultiDropdown';
import { useProductsStore } from '@providers/ProductsStoreProvider';
import { useRootStore } from '@providers/RootStoreContext';
import Loader from '@components/Loader';
import OnlyClient from '@components/OnlyClient';

const ProductSearch = () => {
  const { categoriesStore, queryParamsStore } = useRootStore();
  
  const searchStore = useSearchStore();
  const productsStore = useProductsStore()
  const handleCrossInputClick = useCallback(() => {
    searchStore.changeInput('');
  }, [searchStore]);

  const handleCrossFilterClick = useCallback(() => {
    searchStore.selectCategories([]);
  }, [searchStore]);

  const handleSearchClick = useCallback(() => {
    const params = queryParamsStore.queryObject;
    productsStore.fetchProducts(params)
  }, [queryParamsStore.queryObject, productsStore]);

  const handleInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      const params = queryParamsStore.queryObject;
      productsStore.fetchProducts(params)      
    }
  }, [queryParamsStore.queryObject, productsStore])

  useEffect(() => {
    if(categoriesStore.status === META_STATUS.IDLE) {
      categoriesStore.fetchCategories()
    }
  }, [categoriesStore])


  return (
    <div className={clsx(style['search'])}>
      <div className={clsx(style['query'])}>
        <div className={clsx(style['query-input'])}>
          <Input
            value={searchStore.inputValue}
            onChange={searchStore.changeInput}
            placeholder={'Что будем искать?'}
            className={clsx(style['query-input-element'])}
            name="searchInput"
            onKeyDown={handleInputKeyDown}
          />
          {searchStore.inputValue.length > 0 &&
            <OnlyClient>
              <CrossIcon
                onClick={handleCrossInputClick}
                className={clsx(style['query-input-cross'])}
              />
            </OnlyClient>
          } 
        </div>

        <Button
          onClick={handleSearchClick}
          disabled={productsStore.status === META_STATUS.PENDING}
          className={clsx(style['query-button'])}
          name="searchButton"
        >
          {productsStore.status === META_STATUS.PENDING 
            ? <Loader size='s' className={clsx(style['query-button__icon'])}/>
            : <SearchIcon className={clsx(style['query-button__icon'])} />
          }
          {<div className={clsx(style['query-button__text'])}>Найти</div>}
        </Button>
      </div>
      <div className={clsx(style['filter'])}>
        {categoriesStore.status === META_STATUS.IDLE ? (
          <div className={clsx(style['filter'], style['filter-skeleton'])} />
        ) : (
          <MultiDropdown
            options={searchStore.categoriesOptions}
            value={searchStore.categoriesValue}
            onChange={searchStore.selectCategories}
            getTitle={() => searchStore.titleCategoriesValue}
            className={clsx(style['filter-dropdown'])}
          />
        )}
        {searchStore.selectedCategories.length > 0 &&
          <OnlyClient>
            <CrossIcon onClick={() => {handleCrossFilterClick()}} className={clsx(style['filter-cross'])} />
          </OnlyClient>
        }
      </div>
    </div>
  );
};

export default observer(ProductSearch);