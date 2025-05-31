import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useListOrders } from '@/apis/hooks/sales';
import { useCallback } from 'react';
import { OrderFilter } from './filter-order';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderListRequest } from '@/apis/types/sales';

import useListPageState from '@/hooks/useListPageState'; // Assuming the path to your custom hook

const searchByOptions = [
  { label: 'Mã đơn hàng', value: 'ORDER_CODE' },
  { label: 'Tên khách hàng', value: 'CUSTOMER_NAME' },
  { label: 'Số điện thoại khách hàng', value: 'CUSTOMER_PHONE' },
];

export default function OrdersListPage() {
  const {
    filter,
    pageIndex,
    pageSize,
    searchTerm,
    searchByValue,
    setPageIndex,
    setSearchTerm,
    setSearchByValue,
    setExternalFilters,
  } = useListPageState<OrderListRequest>({
    initialPage: 0,
    initialSize: 10,
    initialSearchBy: 'ORDER_CODE',
    resetPageIndexOnFilterChange: true,
  });

  const { data, isLoading } = useListOrders({
    page: filter.page,
    size: filter.size,
    request: filter,
  });

  const columns = [
    {
      accessorKey: 'code',
      header: 'Mã đơn hàng', // Translated: Order Code
    },
    {
      accessorKey: 'customerName',
      header: 'Tên khách hàng', // Translated: Customer Name
    },
    {
      accessorKey: 'customerPhone',
      header: 'Số điện thoại khách hàng', // Translated: Customer Phone
    },
    {
      accessorKey: 'finalAmount',
      header: 'Tổng tiền', // Translated: Final Amount
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái', // Translated: Status
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo', // Translated: Created At
    },
  ];

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchByChange = (value: string) => {
    setSearchByValue(value as OrderListRequest['searchBy']);
  };

  const onFilter = useCallback(
    (values: Omit<OrderListRequest, 'page' | 'size' | 'search' | 'searchBy'>) => {
      setExternalFilters(values);
    },
    [setExternalFilters]
  );

  return (
    <div className="mx-auto">
      <PageHeader
        title="Đơn hàng" // Translated: Orders
        description="Xem và quản lý các đơn hàng của khách hàng" // Translated: View and manage customer orders
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        {/* Sidebar Filter */}
        <div className="sticky top-8">
          <OrderFilter onFilter={onFilter} />
        </div>

        {/* Order List Table */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <CardDescription>Quản lý đơn hàng.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 w-1/2 min-w-xs mb-4">
              <Input
                placeholder="Tìm đơn hàng..." // Translated: Find order...
                className="flex-grow"
                value={searchTerm}
                onChange={(e) => handleSearchInputChange(e.target.value)}
              />
              <div className="w-1/3 min-w-[150px]">
                <Select onValueChange={handleSearchByChange} defaultValue={searchByValue || 'ORDER_CODE'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tìm kiếm theo" /> {/* Translated: Search by */}
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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
