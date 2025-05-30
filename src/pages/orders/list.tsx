import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useListOrders } from '@/apis/hooks/sales';
import { useState } from 'react';
import { OrderFilter } from './filter-order';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderListRequest } from '@/apis/types/sales'; // Import the type for searchBy

const searchByOptions = [
  { label: 'Mã đơn hàng', value: 'ORDER_CODE' },
  { label: 'Tên khách hàng', value: 'CUSTOMER_NAME' },
  { label: 'Số điện thoại khách hàng', value: 'CUSTOMER_PHONE' },
];

export default function OrdersListPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<OrderListRequest>({});
  const [searchBy, setSearchBy] = useState<string | undefined>(undefined); // Default search by code

  const { data, isLoading } = useListOrders({
    page: pageIndex,
    size: pageSize,
    request: { ...filters, searchBy: searchBy as OrderListRequest['searchBy'], search: filters.search }, // Include search and searchBy in the request
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

  const handleSearchInputChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

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
            <div className="flex gap-2 w-1/2 min-w-xs mb-4">
              {' '}
              {/* Added flex container for search and select */}
              <Input
                placeholder="Tìm đơn hàng..."
                className="flex-grow" // Make Input take available space
                onChange={(e) => handleSearchInputChange(e.target.value)}
              />
              <div className="w-1/3 min-w-[150px]">
                {' '}
                {/* Added container for Select */}
                <Select onValueChange={(value) => setSearchBy(value)} defaultValue="ORDER_CODE">
                  <SelectTrigger>
                    <SelectValue placeholder="Tìm kiếm theo" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchByOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={data?.content || []}
              isLoading={isLoading}
              pageCount={data?.totalPages || 0}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={setPageIndex}
              // searchKey and searchPlaceholder removed as filtering is handled via filter state
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
