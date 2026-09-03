import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  delayMs?: number;
}

export function useSearch<T>({ data, searchKeys, delayMs = 250 }: UseSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, delayMs);

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return data;

    const term = debouncedSearchTerm.toLowerCase().trim();

    return data.filter((item) => {
      return searchKeys.some((key) => {
        const val = item[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchKeys, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    isSearching: searchTerm !== debouncedSearchTerm,
  };
}
