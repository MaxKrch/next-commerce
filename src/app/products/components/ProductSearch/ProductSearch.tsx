"use client"

import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import { KeyboardEvent, useCallback, useEffect } from 'react';
import style from './ProductSearch.module.scss';
import useSearchStore from '@store/local/SearchStore/useSearchStore';
import { META_STATUS } from '@constants/meta-status';
import { useProductsStore } from '@providers/ProductsStoreProvider';
import { useRootStore } from '@providers/RootStoreContext';
import SearchQuery from './components/SearchQuery';
import CategoriesFilter from './components/CategoriesFilter';
import ProductSort from './components/ProductSort';
import Text from '@components/Text';
import CheckBox from '@components/CheckBox';

const ProductSearch = () => {
  const { categoriesStore, queryParamsStore } = useRootStore();
  const searchStore = useSearchStore();
  const productsStore = useProductsStore();

  const handleInputCrossClick = useCallback(() => {
    searchStore.changeInput('');
  }, [searchStore]);

  const handleFilterCrossClick = useCallback(() => {
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
      <SearchQuery
        inputValue={searchStore.inputValue}
        onChange={searchStore.changeInput}
        onInputKeyDown={handleInputKeyDown}
        onInputCrossClick={handleInputCrossClick}
        onSearchClick={handleSearchClick}
        searchStatus={productsStore.status}
        className={clsx(style['search-query'])}
      />
      
      <CategoriesFilter
        options={searchStore.categoriesOptions}
        value={searchStore.categoriesValue}
        onChange={searchStore.selectCategories}
        getTitle={() => searchStore.titleCategoriesValue}
        status={categoriesStore.status}
        onFilterCrossClick={handleFilterCrossClick}
        className={clsx(style['search-categories-filter'])} 
      />

      <ProductSort />
      <div>
        <Text>
          Только доступные для заказа
        </Text>
        <CheckBox
          checked={searchStore.inStock}
          onChange={() => {searchStore.setInStock(!searchStore.inStock)}} 
          checkSize="small"
        />
      </div>
    </div>
  );
};

export default observer(ProductSearch);