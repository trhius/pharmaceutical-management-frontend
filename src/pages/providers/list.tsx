import { useState, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useSuppliers } from '@/apis/hooks/supplier';
import { SupplierResponse, SupplierListRequest } from '@/apis/types/supplier';
import { ProviderFilterSidebar } from './filter-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddProviderDialog } from './add-provider-dialog';

export default function ProvidersListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  // const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<SupplierListRequest>({});

  const { data, isLoading, refetch } = useSuppliers({
    page: pageIndex,
    size: pageSize,
    request: filter,
  });

  const onApplyFilters = useCallback((values: SupplierListRequest) => {
    setFilter(values);
    setPageIndex(0); // Reset to first page when filters change
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
  ];

  return (
    <div className="mx-auto">
      <PageHeader
        title="Providers"
        description="Manage your providers and their information."
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
            <CardTitle>Provider List</CardTitle>
            <CardDescription>Manage your suppliers and their information.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable<SupplierResponse, unknown>
              columns={columns}
              data={data?.content || []}
              isLoading={isLoading}
              pageCount={data?.totalPages || 0}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={setPageIndex}
              searchKey="name" // Assuming search by name is the default/most common
              searchPlaceholder="Search providers..."
              // expandedContent prop can be added here if needed later
            />
          </CardContent>
        </Card>
      </div>

      <AddProviderDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onProviderAdded={refetch} />
    </div>
  );
}
