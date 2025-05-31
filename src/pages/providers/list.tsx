import { useState, useCallback } from 'react';
import { PlusCircle, FileOutput } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import useListPageState from '@/hooks/useListPageState';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useSuppliers, useExportSuppliers } from '@/apis/hooks/supplier'; // Import useExportSuppliers
import { SupplierResponse, SupplierListRequest } from '@/apis/types/supplier';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast'; // Import useToast

const searchByOptions = [
  { label: 'Tên', value: 'NAME' },
  { label: 'Mã', value: 'CODE' },
  { label: 'Số điện thoại', value: 'PHONE' },
];
import { ProviderFilterSidebar } from './filter-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddProviderDialog } from './add-provider-dialog';

export default function ProvidersListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast(); // Initialize useToast hook

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
  } = useListPageState<SupplierListRequest>({
    initialSize: 10,
    initialSearchBy: 'NAME',
    resetPageIndexOnFilterChange: true,
    debounceDelay: 500,
  });

  const { data, isLoading, refetch } = useSuppliers({
    request: filter,
  });

  // Initialize the export mutation hook without onSuccess/onError here
  const exportSuppliersMutation = useExportSuppliers();
  const isExporting = exportSuppliersMutation.isPending; // Use isPending from the mutation object

  const onApplyFilters = useCallback(
    (values: Omit<SupplierListRequest, 'page' | 'size' | 'search' | 'searchBy'>) => {
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
          link.setAttribute('download', 'suppliers_export.xlsx'); // Set the desired filename
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
      accessorKey: 'address',
      header: 'Địa chỉ',
    },
  ];

  return (
    <div className="mx-auto">
      <PageHeader
        title="Nhà cung cấp"
        description="Quản lý các nhà cung cấp và thông tin của họ."
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm nhà cung cấp
          </Button>
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
              {/* Added flex container */}
              <div className="flex gap-2 w-1/2 min-w-sm">
                {' '}
                {/* Added container for search input and select */}
                <Input
                  placeholder="Tìm nhà cung cấp..."
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
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
              </div>
              {/* Export Button */}
              <Button onClick={handleExportClick} disabled={isLoading || isExporting}>
                <FileOutput className="mr-2 h-4 w-4" />
                {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
              </Button>
            </div>
            <DataTable<SupplierResponse, unknown>
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

      <AddProviderDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onProviderAdded={refetch} />
    </div>
  );
}
