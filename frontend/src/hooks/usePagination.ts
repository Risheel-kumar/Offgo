import { useState, useMemo } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  initialPageSize?: number;
}

export function usePagination<T>({ data, initialPageSize = 10 }: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems: data.length,
    currentData,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
}
