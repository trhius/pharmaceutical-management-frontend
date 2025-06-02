import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useListOrders, useExportOrders } from '@/apis/hooks/sales'; // Import useExportOrders
import { useCallback } from 'react';
import { OrderFilter } from './filter-order';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderListRequest } from '@/apis/types/sales';
import { FileOutput } from 'lucide-react'; // Import FileOutput icon, ListOrdered icon
import { Button } from '@/components/ui/button'; // Import Button component
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { format } from 'date-fns';

import useListPageState from '@/hooks/useListPageState'; // Assuming the path to your custom hook
import { SortDropdown } from '@/components/ui/sort-dropdown'; // Import SortDropdown
import { Badge } from '@/components/ui/badge';
import { paymentMethods } from '@/apis/types/transform';

const searchByOptions = [
  { label: 'Mã đơn hàng', value: 'ORDER_CODE' },
  { label: 'Tên khách hàng', value: 'CUSTOMER_NAME' },
  { label: 'Số điện thoại khách hàng', value: 'CUSTOMER_PHONE' },
];

const sortableColumns = [
  { value: 'CODE', label: 'Mã đơn hàng' },
  { value: 'CREATED_AT', label: 'Ngày tạo' },
  { value: 'CUSTOMER_NAME', label: 'Tên khách hàng' },
  { value: 'SOLD_BY', label: 'Nhân viên bán hàng' },
  { value: 'TOTAL_AMOUNT', label: 'Tổng tiền' },
  { value: 'STATUS', label: 'Trạng thái' },
  { value: 'PAYMENT_METHOD', label: 'Phương thức thanh toán' },
];

export default function OrdersListPage() {
  const {
    filter,
    pageIndex,
    pageSize,
    searchTerm,
    searchByValue,
    sortBy, // Destructure sortBy
    sortOrder, // Destructure sortOrder
    setPageIndex,
    setSearchTerm,
    setSearchByValue,
    setSortBy, // Destructure setSortBy
    setSortOrder, // Destructure setSortOrder
    setExternalFilters,
  } = useListPageState<OrderListRequest>({
    initialPage: 0,
    initialSize: 10,
    initialSearchBy: 'ORDER_CODE',
    resetPageIndexOnFilterChange: true,
  });

  const { data, isLoading } = useListOrders({
    page: pageIndex,
    size: pageSize,
    sortBy,
    sortOrder,
    request: filter, // Include sortBy and sortOrder in the request
  });

  const exportOrdersMutation = useExportOrders(); // Initialize export hook
  const { toast } = useToast(); // Initialize toast hook
  const isExporting = exportOrdersMutation.isPending; // Get export loading state

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
      accessorKey: 'soldBy',
      header: 'Nhân viên bán hàng', // Translated: Customer Phone
    },
    {
      accessorKey: 'finalAmount',
      header: 'Tổng tiền', // Translated: Final Amount
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo', // Translated: Created At
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái', // Translated: Status
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Phương thức thanh toán',
      cell: ({ row }: any) => {
        const paymentMethod = row.original.paymentMethod;
        const paymentMethodName = paymentMethods.find((method) => method.value === paymentMethod)?.label;
        return <Badge variant="default">{paymentMethodName}</Badge>;
      },
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

  // Handle export button click
  const handleExportClick = () => {
    exportOrdersMutation.mutate(
      { request: filter as OrderListRequest }, // Pass the filtered request
      {
        onSuccess: (blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `DanhSachDonHang_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast({
            title: 'Xuất dữ liệu thành công',
            description: 'Tệp dữ liệu đơn hàng đã được tải xuống.',
          });
        },
        onError: (error) => {
          console.error('Export failed:', error);
          toast({
            title: 'Xuất dữ liệu thất bại',
            description: 'Đã xảy ra lỗi khi xuất dữ liệu đơn hàng.',
            variant: 'destructive',
          });
        },
      }
    );
  };

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
            <div className="flex items-center justify-between gap-2 mb-4">
              {' '}
              {/* Added flex container */}
              <div className="flex gap-2 w-1/2 min-w-xs">
                {' '}
                {/* Container for search input and select */}
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
                <Input
                  placeholder="Tìm đơn hàng..." // Translated: Find order...
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </div>
              {/* Export Button */}
              <div className="flex gap-2">
                {/* Sort Dropdown */}
                <SortDropdown
                  sortableColumns={sortableColumns}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                />
                {/* Export Button */}
                <Button onClick={handleExportClick} disabled={isLoading || isExporting}>
                  <FileOutput className="mr-2 h-4 w-4" /> {/* Added icon */}
                  {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </Button>
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
