import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useListOrders } from '@/apis/hooks/sales';
import { useState } from 'react';
import { OrderFilter } from './filter-order';

export default function OrdersListPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useListOrders({
    page: pageIndex,
    size: pageSize,
    request: filters,
  });

  const columns = [
    {
      accessorKey: 'code',
      header: 'Order Code',
    },
    {
      accessorKey: 'customerName',
      header: 'Customer Name',
    },
    {
      accessorKey: 'customerPhone',
      header: 'Customer Phone',
    },
    {
      accessorKey: 'finalAmount',
      header: 'Final Amount',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
    },
  ];

  return (
    <div className="mx-auto">
      <PageHeader title="Orders" description="View and manage customer orders" />

      <div className="flex min-h-screen items-start gap-8 py-8">
        {/* Sidebar Filter */}
        <div className="sticky top-8">
          <OrderFilter onFilter={setFilters} />
        </div>

        {/* Order List Table */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <CardDescription>Quản lý đơn hàng.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data?.content || []}
              isLoading={isLoading}
              pageCount={data?.totalPages || 0}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={setPageIndex}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
