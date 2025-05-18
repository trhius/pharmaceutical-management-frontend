import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilter = useCallback((key: string) => searchParams.get(key), [searchParams]);

  const getAllFilters = useCallback(() => {
    const filters: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    return filters;
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams);

      // Update all provided filters
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key); // Remove empty filters
        }
      });

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  return { getFilter, getAllFilters, updateFilters };
}
