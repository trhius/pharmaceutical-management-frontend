import { useState, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddCustomerDialog } from './add-customer-dialog';
import { EditCustomerDialog } from './edit-customer-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';
import { TableFilterSidebar } from './filter-customer';

import { useCustomers, useDeactivateCustomer } from '@/apis/hooks/customer';
import { useToast } from '@/hooks/use-toast';
import { CustomerResponse, CustomerListRequest } from '@/apis/types/customer';
import { format } from 'date-fns';
import { ageGroups } from '@/apis/types/transform';

export default function CustomersListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);

  const deleteCustomerMutation = useDeactivateCustomer();
  const { toast } = useToast();

  const [filter, setFilter] = useState<CustomerListRequest>({});
  const { data: customersData, isLoading, refetch } = useCustomers({ request: filter });
  const customers = customersData?.content;

  const handleEdit = (customer: CustomerResponse) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const onFilter = useCallback((values: CustomerListRequest) => {
    setFilter(values);
  }, []);

  const columns = [
    {
      accessorKey: 'customerCode',
      header: 'Mã khách hàng',
    },
    {
      accessorKey: 'name',
      header: 'Tên khách hàng',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Số điện thoại',
    },
    {
      accessorKey: 'address',
      header: 'Địa chỉ',
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }: any) => {
        const date = row.original.createdAt;
        return <span>{date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A'}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
            {status === 'ACTIVE' ? 'Đang hoạt động' : status === 'INACTIVE' ? 'Ngừng hoạt động' : 'Đã vô hiệu hóa'}
          </Badge>
        );
      },
    },
  ];

  const renderExpandedContent = (customer: CustomerResponse) => {
    return (
      <div className="space-y-4">
        <div className="w-full max-w-5xl rounded-md p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Row 1 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mã khách hàng</p>
              <p className="text-sm font-medium">{customer.customerCode}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Họ và Tên</p>
              <p className="text-sm font-medium">{customer.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{customer.email}</p>
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Số điện thoại</p>
              <p className="text-sm font-medium">{customer.phoneNumber}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Địa chỉ</p>
              <p className="text-sm font-medium">{customer.address}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày sinh</p>
              <p className="text-sm font-medium">
                {customer.dayOfBirth ? format(new Date(customer.dayOfBirth), 'dd/MM/yyyy') : 'N/A'}
              </p>
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Giới tính</p>
              <p className="text-sm font-medium">
                {customer.gender === 'MALE' ? 'Nam' : customer.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Nhóm tuổi</p>
              <p className="text-sm font-medium">
                {ageGroups.find((ageGroup) => ageGroup.value === customer.ageGroup)?.label}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Tổng chi tiêu</p>
              <p className="text-sm font-medium">{customer.totalSpentAmount || 0}</p>
            </div>

            {/* Row 4 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Trạng thái</p>
              <p className="text-sm font-medium">
                {customer.status === 'ACTIVE'
                  ? 'Đang hoạt động'
                  : customer.status === 'INACTIVE'
                    ? 'Ngừng hoạt động'
                    : 'Đã vô hiệu hóa'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày tạo</p>
              <p className="text-sm font-medium">
                {customer.createdAt ? format(new Date(customer.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
              <p className="text-sm font-medium">
                {customer.updatedAt ? format(new Date(customer.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => customer.customerCode && navigator.clipboard.writeText(customer.customerCode)}
            >
              Sao chép Mã khách hàng
            </Button>
            {customer.id && (
              <Button variant="outline" onClick={() => handleEdit(customer)}>
                Chỉnh sửa chi tiết
              </Button>
            )}
            {customer.id && customer.status === 'ACTIVE' && (
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Vô hiệu hóa
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
        title="Khách hàng"
        description="Xem và quản lý tất cả khách hàng"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm khách hàng
          </Button>
        }
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div className="sticky top-8">
          <TableFilterSidebar onFilter={onFilter} />
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
            <CardDescription>Quản lý khách hàng lẻ và khách hàng sỉ.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={customers || []}
              searchKey="name"
              searchPlaceholder="Tìm kiếm khách hàng..."
              expandedContent={renderExpandedContent}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <AddCustomerDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onCustomerAdded={refetch} />

      {selectedCustomer && (
        <EditCustomerDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} customer={selectedCustomer} />
      )}

      {selectedCustomer && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Vô hiệu hóa khách hàng"
          description={`Bạn có chắc chắn muốn vô hiệu hóa khách hàng ${selectedCustomer?.name}? Hành động này không thể hoàn tác.`}
          confirmText={deleteCustomerMutation.isPending ? 'Đang vô hiệu hóa...' : 'Vô hiệu hóa'}
          onConfirm={() => {
            if (selectedCustomer?.id) {
              deleteCustomerMutation.mutate(selectedCustomer.id, {
                onSuccess: () => {
                  setIsDeleteDialogOpen(false);
                  setSelectedCustomer(null); // Clear selected customer after deletion
                  refetch();
                  toast({
                    title: 'Vô hiệu hóa khách hàng thành công',
                    description: `Thông tin của ${selectedCustomer?.name} đã được cập nhật trạng thái.`,
                  });
                },
                onError: (error) => {
                  console.error('Failed to deactivate customer:', error);
                  setIsDeleteDialogOpen(false);
                  setSelectedCustomer(null); // Clear selected customer even on error
                  // Optionally show an error toast here
                },
              });
            }
          }}
        />
      )}
    </div>
  );
}
