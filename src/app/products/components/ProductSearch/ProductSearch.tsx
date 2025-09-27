"use client"

import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
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

const ProductSearch = () => {
  const { categoriesStore, queryParamsStore } = useRootStore();
  const searchStore = useSearchStore();
  const prodactsStore = useProductsStore()

  const handleCrossInputClick = useCallback(() => {
    searchStore.changeInput('');
  }, [searchStore]);

  const handleCrossFilterClick = useCallback(() => {
    searchStore.selectCategories([]);
  }, [searchStore]);

  const handleSearchClick = useCallback(() => {
    const params = queryParamsStore.queryObject;
    prodactsStore.fetchProducts(params)
  }, [queryParamsStore.queryString, prodactsStore])

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
          />
          {searchStore.inputValue.length > 0 && (
            <CrossIcon
              onClick={handleCrossInputClick}
              className={clsx(style['query-input-cross'])}
            />
          )}
        </div>

        <Button
          onClick={handleSearchClick}
          disabled={false}
          className={clsx(style['query-button'])}
          name="searchButton"
        >
          <SearchIcon className={clsx(style['query-button-icon'])} />
          {<div className={clsx(style['query-button-text'])}>Найти</div>}
        </Button>
      </div>
      <div className={clsx(style['filter'])}>
        {categoriesStore.status === META_STATUS.SUCCESS ? (
          <MultiDropdown
            options={searchStore.categoriesOptions}
            value={searchStore.categoriesValue}
            onChange={searchStore.selectCategories}
            getTitle={() => searchStore.titleCategoriesValue}
            className={clsx(style['filter-dropdown'])}
          />
        ) : (
          <div className={clsx(style['filter'], style['filter-skeleton'])} />
        )}

        {searchStore.categoriesValue.length > 0 && (
          <CrossIcon onClick={() => {handleCrossFilterClick()}} className={clsx(style['filter-cross'])} />
        )} 
      </div>
    </div>
  );
};

export default observer(ProductSearch);
