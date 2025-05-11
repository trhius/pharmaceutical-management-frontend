import type { RowConfigs } from 'src/components/table/table-row';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/components/table/use-table';
import { CustomTableRow } from 'src/components/table/table-row';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';
import { TableEmptyRows } from 'src/components/table/table-empty-rows';
import { CustomTableToolbar } from 'src/components/table/table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

// ----------------------------------------------------------------------

export type Header = {
  id: string;
  label?: string;
  align?: string;
};

export type TableProps = {
  data: { id: string }[];
  headerConfigs: Header[];
  rowConfigs: RowConfigs;
  toolbar?: boolean;
};

export function DTable({ data, headerConfigs, rowConfigs, toolbar }: TableProps) {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: typeof data = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Card>
      {toolbar && <CustomTableToolbar
        numSelected={table.selected.length}
        filterName={filterName}
        onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFilterName(event.target.value);
          table.onResetPage();
        }}
      />}

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <CustomTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={data.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  data.map((row) => row.id)
                )
              }
              headLabel={headerConfigs}
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <CustomTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    config={rowConfigs}
                  />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
              />

              {notFound && <TableNoData searchQuery={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        component="div"
        page={table.page}
        count={data.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
