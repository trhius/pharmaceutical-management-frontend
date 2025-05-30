import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  expandedContent?: (row: TData) => React.ReactNode;
  isLoading?: boolean;
  pageCount?: number;
  pageSize?: number;
  pageIndex?: number;
  onPageChange?: (pageIndex: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Tìm kiếm...',
  onRowClick,
  expandedContent,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    pageCount: pageCount,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: pageIndex || 0,
        pageSize: pageSize || 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: pageIndex || 0, pageSize: pageSize || 10 });
        onPageChange?.(newState.pageIndex);
      }
    },
    manualPagination: true,
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    setExpandedRows({});
  }, [pageIndex]);

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (expandedContent ? 1 : 0)} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn('cursor-pointer hover:bg-muted/50', expandedRows[row.id] && 'bg-muted/50')}
                    onClick={() => {
                      if (expandedContent) {
                        toggleRow(row.id);
                      }
                      onRowClick?.(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                    {expandedContent && (
                      <TableCell className="w-4">
                        {expandedRows[row.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </TableCell>
                    )}
                  </TableRow>
                  {expandedContent && expandedRows[row.id] && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="p-0">
                        <div className="border-t bg-muted/50 p-4">{expandedContent(row.original)}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="text-sm text-muted-foreground">
          Trang {table.getState().pagination.pageIndex + 1} / {pageCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Tiếp
          </Button>
        </div>
      </div>
    </div>
  );
}
