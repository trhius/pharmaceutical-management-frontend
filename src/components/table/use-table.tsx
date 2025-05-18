import type { SelectChangeEvent } from '@mui/material';

import { useState, useCallback } from 'react';

import { useFilter } from 'src/hooks/useFilter';
// ----------------------------------------------------------------------

export function useTable() {
  const { getFilter, updateFilters } = useFilter();
  const [page, setPage] = useState(() => Number(getFilter('page')) || 1);
  const [orderBy, setOrderBy] = useState(getFilter('sortBy'));
  const [rowsPerPage, setRowsPerPage] = useState(() => Number(getFilter('size')) || 10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>(
    () => (getFilter('sortOrder')?.toLowerCase() as 'asc' | 'desc') || 'asc'
  );

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
      updateFilters({ sortBy: id, sortOrder: isAsc ? 'DESC' : 'ASC' });
    },
    [order, orderBy, updateFilters]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
    updateFilters({ page: '0' });
  }, [updateFilters]);

  const onPageChange = useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
      updateFilters({ page: newPage.toString() });
    },
    [updateFilters]
  );

  const onChangeRowsPerPage = useCallback(
    (event: SelectChangeEvent) => {
      const newSize = parseInt(event.target.value as string, 10);
      setRowsPerPage(newSize);
      updateFilters({ size: newSize.toString() });
    },
    [updateFilters]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onPageChange,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
