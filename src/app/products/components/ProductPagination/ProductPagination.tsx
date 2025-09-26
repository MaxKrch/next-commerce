import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';

const ProductPagination: React.FC = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  const { productsStore } = useRootStore();
  const { pageCount, total } = productsStore.pagination || {};

  const currentPage = useMemo(
    () => normalizeCurrentPage(Number(queryParams.page ?? 1), pageCount),
    [queryParams.page, pageCount]
  );

  useEffect(() => {
    if (pageCount && pageCount < currentPage) {
      setQueryParams({ page: pageCount });
    }
  }, [pageCount, queryParams.page, currentPage, setQueryParams]);

  const handleClick = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        setQueryParams({ page });
      }
    },
    [currentPage, setQueryParams]
  );

  if (!pageCount || total === 0) {
    return null;
  }

  return <Pagination currentPage={currentPage} onClick={handleClick} pageCount={pageCount} />;
};

export default observer(ProductPagination);
