import { useState, useCallback } from 'react';
import { PlusCircle, FileOutput } from 'lucide-react'; // Import ListOrdered icon
import { PageHeader } from '@/components/layout/page-header';
import useListPageState from '@/hooks/useListPageState';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useSuppliers, useExportSuppliers, useDeactivateSupplier } from '@/apis/hooks/supplier'; // Import useExportSuppliers
import { SupplierResponse, SupplierListRequest } from '@/apis/types/supplier';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { SortDropdown } from '@/components/ui/sort-dropdown'; // Import SortDropdown
import { format } from 'date-fns';

import { ProviderFilterSidebar } from './filter-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddProviderDialog } from './add-provider-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EditProviderDialog } from './edit-provider-dialog';

const searchByOptions = [
  { label: 'Tên nhà cung cấp', value: 'NAME' },
  { label: 'Mã nhà cung cấp', value: 'CODE' },
  { label: 'Số điện thoại', value: 'PHONE' },
];

const sortableColumns = [
  { value: 'CODE', label: 'Mã nhà cung cấp' },
  { value: 'NAME', label: 'Tên nhà cung cấp' },
  { value: 'PHONE', label: 'Số điện thoại' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'ADDRESS', label: 'Địa chỉ' },
  { value: 'CONTACT_PERSON', label: 'Người liên hệ' },
  { value: 'CREATED_AT', label: 'Ngày tạo' },
];

export default function ProvidersListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SupplierResponse | null>(null);
  const { toast } = useToast(); // Initialize useToast hook

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
  } = useListPageState<SupplierListRequest>({
    initialSize: 10,
    initialSearchBy: 'NAME',
    resetPageIndexOnFilterChange: true,
    debounceDelay: 500,
  });

  const { data, isLoading, refetch } = useSuppliers({
    sortBy,
    sortOrder,
    request: filter,
  });

  // Initialize the export mutation hook without onSuccess/onError here
  const exportSuppliersMutation = useExportSuppliers();
  const isExporting = exportSuppliersMutation.isPending; // Use isPending from the mutation object

  const deleteProviderMutation = useDeactivateSupplier();

  const onApplyFilters = useCallback(
    (values: Omit<SupplierListRequest, 'page' | 'size' | 'search' | 'searchBy' | 'sortBy' | 'sortOrder'>) => {
      // Adjust type definition
      setExternalFilters(values);
    },
    [setExternalFilters]
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchByChange = (value: string) => {
    setSearchByValue(value as SupplierListRequest['searchBy']);
  };

  // Handle export button click with dynamic onSuccess/onError callbacks
  const handleExportClick = () => {
    exportSuppliersMutation.mutate(
      { request: filter as SupplierListRequest }, // Pass the filtered request
      {
        onSuccess: (blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `DanhSachNhaCung_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast({
            title: 'Xuất dữ liệu thành công',
            description: 'Tệp dữ liệu nhà cung cấp đã được tải xuống.',
          });
        },
        onError: (error) => {
          console.error('Export failed:', error);
          toast({
            title: 'Xuất dữ liệu thất bại',
            description: 'Đã xảy ra lỗi khi xuất dữ liệu nhà cung cấp.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const columns = [
    {
      accessorKey: 'code',
      header: 'Mã',
    },
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'contactPerson',
      header: 'Người liên hệ',
    },
    {
      accessorKey: 'phone',
      header: 'Số điện thoại',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'ACTIVE' ? 'success' : 'destructive'}>
            {status === 'ACTIVE' ? 'Đang hoạt động' : status === 'INACTIVE' ? 'Ngừng hoạt động' : 'Đã vô hiệu hóa'}
          </Badge>
        );
      },
    },
  ];

  const renderExpandedContent = (supplier: SupplierResponse) => {
    return (
      <div className="space-y-4">
        <div className="w-full rounded-md p-2">
          <div className="flex items-center gap-4 mb-6">
            <p className="font-bold text-lg">
              {supplier.name} - {supplier.code}
            </p>
            <Badge variant={supplier.status === 'ACTIVE' ? 'success' : 'destructive'}>
              {supplier.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Số điện thoại</p>
              <p className="text-sm font-medium">{supplier.phone || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{supplier.email || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Người liên hệ</p>
              <p className="text-sm font-medium">{supplier.contactPerson || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày tạo</p>
              <p className="text-sm font-medium">
                {supplier.createdAt ? format(new Date(supplier.createdAt), 'dd/MM/yyyy HH:mm') : '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Người tạo</p>
              <p className="text-sm font-medium">{supplier.createdBy || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
              <p className="text-sm font-medium">
                {supplier.updatedAt ? format(new Date(supplier.updatedAt), 'dd/MM/yyyy HH:mm') : '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mã số thuế</p>
              <p className="text-sm font-medium">{supplier.taxCode || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Địa chỉ</p>
              <p className="text-sm font-medium">{supplier.address || '-'}</p>
            </div>

            <div className="space-y-1 md:col-span-3">
              <p className="text-xs text-gray-500">Ghi chú</p>
              <p className="text-sm font-medium">{supplier.note || '-'}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedProvider(supplier);
                setIsEditDialogOpen(true);
              }}
            >
              Cập nhật thông tin
            </Button>
            {supplier.id && supplier.status === 'ACTIVE' && (
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedProvider(supplier);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Ngừng hoạt động
              </Button>
            )}
          </div>
        </div> 
      </div>
    );
  };

  return (
    <div className="mx-auto">
      <PageHeader
        title="Nhà cung cấp"
        description="Quản lý các nhà cung cấp và thông tin của họ."
        actions={
          <div className="flex items-center gap-4">
            {/* Add button */}
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm nhà cung cấp
            </Button>
          </div>
        }
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div className="sticky top-8">
          <ProviderFilterSidebar
            isOpen={true}
            onClose={() => {}}
            onApplyFilters={onApplyFilters}
            initialFilters={filter}
          />
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách nhà cung cấp</CardTitle>
            <CardDescription>Quản lý các nhà cung cấp và thông tin của họ.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 mb-4">
              {' '}
              {/* Adjusted gap */} {/* Added flex container */}
              <div className="flex gap-2 w-1/2 min-w-sm">
                {' '}
                {/* Added container for search input and select */}
                <div className="w-1/3 min-w-[150px]">
                  <Select
                    onValueChange={(value) => handleSearchByChange(value)}
                    defaultValue="NAME"
                    value={searchByValue}
                  >
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
                  placeholder="Tìm nhà cung cấp..."
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {/* Sorting Dropdown Menu */}
                <SortDropdown
                  sortableColumns={sortableColumns}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                />

                {/* Export Button */}
                <Button onClick={handleExportClick} disabled={isLoading || isExporting}>
                  <FileOutput className="mr-2 h-4 w-4" />
                  {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </Button>
              </div>
              {/* Export Button is now in the PageHeader actions, remove inline */}
            </div>
            <DataTable<SupplierResponse, unknown>
              columns={columns}
              data={data?.content || []}
              expandedContent={renderExpandedContent}
              isLoading={isLoading}
              pageCount={data?.totalPages || 0}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={setPageIndex}
            />
          </CardContent>
        </Card>
      </div>

      <AddProviderDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onProviderAdded={refetch} />

      {selectedProvider && (
        <EditProviderDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} provider={selectedProvider} />
      )}

      {selectedProvider && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Ngừng hoạt động nhà cung cấp"
          description={`Bạn có chắc chắn muốn ngừng hoạt động nhà cung cấp ${selectedProvider?.name}? Hành động này không thể hoàn tác.`}
          cancelText="Hủy"
          confirmText={deleteProviderMutation.isPending ? 'Đang ngừng hoạt động...' : 'Ngừng hoạt động'}
          onConfirm={() => {
            if (selectedProvider?.id) {
              deleteProviderMutation.mutate(selectedProvider.id, {
                onSuccess: () => {
                  setIsDeleteDialogOpen(false);
                  setSelectedProvider(null); // Clear selected provider after deletion
                  refetch();
                  toast({
                    title: 'Ngừng hoạt động nhà cung cấp thành công',
                    description: `Thông tin của ${selectedProvider?.name} đã được cập nhật trạng thái.`,
                  });
                },
                onError: (error) => {
                  console.error('Failed to deactivate provider:', error);
                  setIsDeleteDialogOpen(false);
                  setSelectedProvider(null); // Clear selected provider even on error
                  toast({
                    title: 'Ngừng hoạt động nhà cung cấp thất bại',
                    description: 'Đã xảy ra lỗi khi ngừng hoạt động nhà cung cấp.',
                    variant: 'destructive',
                  });
                },
              });
            }
          }}
        />
      )}
    </div>
  );
}
