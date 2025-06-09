import { PlusIcon, FileText } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { TableFilterSidebar } from './filter-purchase-order';
import { Badge } from '@/components/ui/badge';
import useListPageState from '@/hooks/useListPageState';
import { PurchaseListRequest, PurchaseListResponse, PurchaseOrderStatus } from '@/apis/types/purchase';
import { useExportPurchaseOrders, usePurchaseOrders } from '@/apis/hooks/purchase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortDropdown } from '@/components/ui/sort-dropdown';
import ExpandedPurchaseOrderDetails from './ExpandedPurchaseOrderDetails';


const searchByOptions = [
  { label: 'Mã nhập hàng', value: 'CODE' },
  { label: 'Tên nhà cung cấp', value: 'NAME' },
];

const sortableColumns = [
  { value: 'CODE', label: 'Mã nhập hàng' },
  { value: 'SUPPLIER_NAME', label: 'Tên nhà cung cấp' },
  { value: 'FINAL_AMOUNT', label: 'Tổng giá trị' },
  { value: 'CREATED_AT', label: 'Ngày tạo' },
  { value: 'CREATED_BY', label: 'Người tạo' },
  { value: 'STATUS', label: 'Trạng thái' },
];

export default function PurchaseOrdersPage() {
    const {
        filter,
        pageIndex,
        pageSize,
        searchTerm,
        searchByValue,
        sortBy,
        sortOrder,
        setPageIndex,
        setSearchTerm,
        setSearchByValue,
        setSortBy,
        setSortOrder,
        setExternalFilters,
      } = useListPageState<PurchaseListRequest>({
        initialPage: 0,
        initialSize: 10,
        initialSearchBy: 'CODE',
        resetPageIndexOnFilterChange: true,
      });

  const { toast } = useToast();

  const { data: poData, isLoading } = usePurchaseOrders({
    ...filter,
    page: pageIndex,
    size: pageSize,
    request: filter,
    sortBy,
    sortOrder: sortOrder,
  });
  const purchaseOrders = poData?.content;

  const exportPurchaseOrdersMutation = useExportPurchaseOrders();

  const onFilter = (values: Omit<PurchaseListRequest, 'page' | 'size' | 'search' | 'searchBy'>) => {
    setExternalFilters(values);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchByChange = (value: string) => {
    setSearchByValue(value as PurchaseListRequest['searchBy']);
  };

  const handleExportClick = () => {
    exportPurchaseOrdersMutation.mutate(
      { request: filter as PurchaseListRequest },
      {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `DanhSachPhieuNhap_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast({
            title: 'Xuất dữ liệu thành công',
            description: 'Tệp phiếu nhập đã được tải xuống.',
          });
        },
        onError: (error: any) => {
          console.error('Export failed:', error);
          toast({
            title: 'Xuất dữ liệu thất bại',
            description: 'Đã xảy ra lỗi khi xuất dữ liệu.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const columns = [
    {
      accessorKey: 'code',
      header: 'Mã nhập hàng',
    },
    {
      accessorKey: 'createdBy',
      header: 'Người tạo',
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }: { row: { original: PurchaseListResponse } }) => (row.original.createdAt ? format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm:ss') : '-'),
    },
    {
      accessorKey: 'supplierName',
      header: 'Nhà cung cấp',
    },
    {
      accessorKey: 'finalAmount',
      header: 'Tổng giá trị',
      // cell: ({ row }: { row: { original: PurchaseListResponse } }) =>
      //     row.original.finalAmount !== undefined ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.finalAmount) : '-'
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: { row: { original: PurchaseListResponse } }) => {
          const status = row.original.status;
          if (!status) return '-';

          const statusText: Record<PurchaseOrderStatus, string> = {
              'DRAFT': 'Phiếu tạm',
              'CONFIRMED': 'Đã nhập hàng',
              'CANCELLED': 'Đã hủy',
          };
          const variant: Record<PurchaseOrderStatus, "default" | "secondary" | "destructive" | "success"> = {
              DRAFT: 'secondary',
              CONFIRMED: 'success',
              CANCELLED: 'destructive',
          }

          return (
            <Badge variant={variant[status]}>
              {statusText[status]}
            </Badge>
          );
        },
    },
  ];

  const renderExpandedContent = (purchaseOrder: PurchaseListResponse) => {
    if (!purchaseOrder.id) return null;
    return <ExpandedPurchaseOrderDetails purchaseOrderId={purchaseOrder.id} />;
  };

  return (
    <div className="mx-auto space-y-4">
      <PageHeader
        title="Nhập hàng"
        description="Quản lý các đơn hàng nhập kho"
        actions={
          <div className="flex gap-2">
              <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nhập hàng
              </Button>
          </div>
        }
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div className="sticky top-8">
            <TableFilterSidebar onFilter={onFilter} />
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách phiếu nhập</CardTitle>
            <CardDescription>Xem và quản lý các phiếu nhập hàng.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex gap-2 w-1/2 min-w-sm">
                 <div className="w-1/3 min-w-[150px]">
                  <Select onValueChange={handleSearchByChange} defaultValue={searchByValue || 'CODE'}>
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
                <Input
                  placeholder="Tìm kiếm theo mã hoặc tên nhà cung cấp..."
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </div>
               <div className="flex gap-2">
                <SortDropdown
                  sortableColumns={sortableColumns}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                />
                <Button onClick={handleExportClick} disabled={isLoading || exportPurchaseOrdersMutation.isPending}>
                    <FileText className="mr-2 w-4 h-4" />
                    {exportPurchaseOrdersMutation.isPending ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </Button>
              </div>
            </div>
            <DataTable
                columns={columns}
                data={purchaseOrders || []}
                expandedContent={renderExpandedContent}
                isLoading={isLoading}
                pageCount={poData?.totalPages || 0}
                pageSize={pageSize}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 