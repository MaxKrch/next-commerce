import { META_STATUS } from 'constants/meta-status';

import { clsx } from 'clsx';
import Button from 'components/Button';
import Input from 'components/Input';
import MultiDropdown from 'components/MultiDropdown';
import CrossIcon from 'components/icons/CrossIcon';
import SearchIcon from 'components/icons/SearchIcon';
import useRootStore from 'context/root-store/useRootStore';
import useQueryParams from 'hooks/useQueryParams';
import useSearchStore from 'hooks/useSearchStore';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import style from './ProductSearch.module.scss';

const ProductSearch = () => {
  const { setQueryParams } = useQueryParams();
  const searchCleared = useRef(false);
  const location = useLocation();
  const { categoriesStore } = useRootStore();
  const searchStore = useSearchStore({ handleChange: setQueryParams });

  const handleCrossInputClick = useCallback(() => {
    searchStore.handleInput('');
  }, [searchStore]);

  const handleCrossFilterClick = useCallback(() => {
    searchStore.handleSelectCategories([]);
  }, [searchStore]);

  useEffect(() => {
    if (location.search !== '') {
      searchCleared.current = false;
      return;
    }

    if (!searchCleared.current) {
      searchStore.resetValues();
      searchCleared.current = true;
    }
  }, [location.search, searchStore]);

  return (
    <div className={clsx(style['search'])}>
      <div className={clsx(style['query'])}>
        <div className={clsx(style['query-input'])}>
          <Input
            value={searchStore.inputValue}
            onChange={searchStore.handleInput}
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
          onClick={searchStore.handleSearch}
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
            options={searchStore.options}
            value={searchStore.value}
            onChange={searchStore.handleSelectCategories}
            getTitle={() => searchStore.title}
            className={clsx(style['filter-dropdown'])}
          />
        ) : (
          <div className={clsx(style['filter'], style['filter-skeleton'])} />
        )}

        {searchStore.value.length > 0 && (
          <CrossIcon onClick={handleCrossFilterClick} className={clsx(style['filter-cross'])} />
        )}
      </div>
    </div>
  );
};

export default observer(ProductSearch);
