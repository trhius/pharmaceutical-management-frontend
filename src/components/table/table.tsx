import type { RowConfigs } from 'src/components/table/table-row';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/components/table/use-table';
import { CustomTableRow } from 'src/components/table/table-row';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';
import { CustomTableToolbar } from 'src/components/table/table-toolbar';

import { DPagination } from '../pagination';

// ----------------------------------------------------------------------

export type Header = {
  id: string;
  label?: string;
  align?: string;
};

export type TableProps = {
  data: { id: number }[];
  totalPages: number;
  headerConfigs: Header[];
  rowConfigs: RowConfigs;
  toolbar?: boolean;
  customSearchKeyword?: string;
  customSearchOptions?: Record<string, string>[];
};

export function DTable({
  data,
  totalPages,
  headerConfigs,
  rowConfigs,
  toolbar,
  customSearchKeyword,
  customSearchOptions,
}: TableProps) {
  const table = useTable();

  const notFound = !data?.length;

  return (
    <Card>
      {toolbar && (
        <CustomTableToolbar
          numSelected={table.selected.length}
          customSearchKeyword={customSearchKeyword}
          customSearchOptions={customSearchOptions}
        />
      )}

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <CustomTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={data?.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  data?.map((row) => '' + row.id)
                )
              }
              headLabel={headerConfigs}
            />
            <TableBody>
              {data?.map((row) => (
                <CustomTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes('' + row.id)}
                  onSelectRow={() => table.onSelectRow('' + row.id)}
                  config={rowConfigs}
                />
              ))}

              {/* <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, data?.length)}
              /> */}

              {notFound && <TableNoData />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <DPagination
        page={table.page}
        count={totalPages}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onPageChange}
        rowsPerPageOptions={[10, 25, 50]}
        onChangeRowsPerPage={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
