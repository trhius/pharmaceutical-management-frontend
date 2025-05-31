import { useState, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import useListPageState from '@/hooks/useListPageState';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useSuppliers } from '@/apis/hooks/supplier';
import { SupplierResponse, SupplierListRequest } from '@/apis/types/supplier';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  // const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

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
  } = useListPageState<SupplierListRequest>({ initialSize: 10, initialSearchBy: 'NAME' });

  const { data, isLoading, refetch } = useSuppliers({
    request: filter,
  });

  const onApplyFilters = useCallback((values: SupplierListRequest) => {
    setExternalFilters(values);
  }, [setExternalFilters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
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
      >
        {/* Add a button to open filter sidebar if needed */}
      </PageHeader>

      <div className="flex min-h-screen items-start gap-8 py-8">
        {/* Filter Sidebar - Currently always visible for simplicity */}
        <div className="sticky top-8">
          <ProviderFilterSidebar
            isOpen={true} // Adjust based on filter button state if added
            onClose={() => {}} // Adjust based on filter button state if added
            onApplyFilters={onApplyFilters}
            initialFilters={filter} // Pass current filters to initialize sidebar
          />
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách nhà cung cấp</CardTitle>
            <CardDescription>Quản lý các nhà cung cấp và thông tin của họ.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 w-1/2 min-w-xs mb-4">
              {' '}
              {/* Added flex container */}
            <Input
              placeholder="Tìm nhà cung cấp..."
              className="flex-grow" // Make Input take available space
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="w-1/3 min-w-[150px]">
              {' '}
              {/* Added container for Select */}
              <Select onValueChange={(value) => setSearchByValue(value as SupplierListRequest['searchBy'])} defaultValue="NAME" value={searchByValue}>
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
            <DataTable<SupplierResponse, unknown>
              columns={columns}
              data={data?.content || []}
              isLoading={isLoading}
              pageCount={data?.totalPages || 0}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={setPageIndex}
              // searchKey and searchPlaceholder removed as filtering is now handled via filter state
            />
          </CardContent>
        </Card>
      </div>

      <AddProviderDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onProviderAdded={refetch} />
    </div>
  );
}
