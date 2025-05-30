import { useCallback, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddEmployeeDialog } from './add-employee-dialog';
import { EditEmployeeDialog } from './edit-employee-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';
import { FilterEmployee } from './filter-employee';
import { useListEmployees, useDeleteEmployee } from '@/apis';
import { EmployeeResponse, ListEmployeeRequest } from '@/apis/types';
import { roles, genders, employeeStatuses } from '@/apis/types/transform';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const searchByOptions = [
  { label: 'Tên nhân viên', value: 'NAME' },
  { label: 'Mã chấm công', value: 'CODE' },
  { label: 'Số điện thoại', value: 'PHONE' },
];

export default function EmployeesListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);

  const [filter, setFilter] = useState<ListEmployeeRequest>({});
  const [searchBy, setSearchBy] = useState<string | undefined>(undefined);
  const listEmployeesData = useListEmployees({ request: filter });
  const employees = listEmployeesData.data?.content;
  const deleteEmployeeMutation = useDeleteEmployee();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleEdit = (employee: EmployeeResponse) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (employee: EmployeeResponse) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSearch = (value: string) => {
    const applyFilter: Partial<ListEmployeeRequest> = value
      ? { search: value, searchBy: 'NAME' }
      : { search: undefined, searchBy: undefined };
    setFilter({ ...filter, ...applyFilter, searchBy: searchBy as ListEmployeeRequest['searchBy'] });
  };

  const onDelete = useCallback(() => {
    if (!selectedEmployee) return;
    deleteEmployeeMutation.mutate(selectedEmployee?.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listEmployees'] });
        toast({
          title: 'Đã xóa nhân viên',
          description: `${selectedEmployee?.fullName} đã được xóa thành công.`, // Use fullName from form data
        });
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        toast({
          title: 'Xóa nhân viên thất bại',
          description: 'Đã xảy ra lỗi xóa nhân viên',
          variant: 'destructive',
        });
      },
    });
  }, [selectedEmployee, deleteEmployeeMutation, queryClient, toast]);

  const onFilter = useCallback((values: ListEmployeeRequest) => {
    setFilter(values);
  }, []);

  const columns = [
    {
      accessorKey: 'employeeCode',
      header: 'Mã nhân viên',
    },
    {
      accessorKey: 'fullName',
      header: 'Tên nhân viên',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'storeName',
      header: 'Chi nhánh',
    },
    {
      accessorKey: 'role',
      header: 'Chức danh',
      cell: ({ row }: any) => {
        return (
          <Badge variant={row.original.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
            {roles.find((role) => role.value === row.original.role)?.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'joinDate',
      header: 'Ngày bắt đầu làm',
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        return (
          <Badge variant={row.original.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {employeeStatuses.find((status) => status.value === row.original.status)?.label}
          </Badge>
        );
      },
    },
  ];

  const renderExpandedContent = (employee: EmployeeResponse) => {
    return (
      <div className="space-y-4">
        <div className="w-full max-w-5xl rounded-md p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Row 1 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mã nhân viên</p>
              <p className="text-sm font-medium">{employee.employeeCode}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Tên nhân viên</p>
              <p className="text-sm font-medium">{employee.fullName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mã chấm công</p>
              <p className="text-sm font-medium"></p>
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày sinh</p>
              <p className="text-sm font-medium">{employee.dateOfBirth}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Giới tính</p>
              <p className="text-sm font-medium">{genders.find((gender) => gender.value === employee.gender)?.label}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Số CMND/CCCD</p>
              <p className="text-sm font-medium">{employee.identityCard}</p>
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Chức danh</p>
              <p className="text-sm font-medium">{roles.find((role) => role.value === employee.role)?.label}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày bắt đầu làm việc</p>
              <p className="text-sm font-medium">{employee.joinDate}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Chi nhánh làm việc</p>
              <p className="text-sm font-medium">{employee.storeName}</p>
            </div>

            {/* Row 4 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Số điện thoại</p>
              <p className="text-sm font-medium">{employee.phone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{employee.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Địa chỉ</p>
              <p className="text-sm font-medium">{employee.address}</p>
            </div>

            {/* Row 5 - Notes (spans full width) */}
            <div className="space-y-1 md:col-span-3">
              <p className="text-xs text-gray-500">Ghi chú</p>
              <p className="text-sm font-medium"></p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleEdit(employee)}>
              Cập nhật thông tin
            </Button>
            {employee.status === 'ACTIVE' && (
              <Button variant="destructive" onClick={() => handleDelete(employee)}>
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
        title="Nhân viên"
        description="Quản lý nhân viên"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm nhân viên
          </Button>
        }
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div className="sticky top-8 max-w-xs">
          <FilterEmployee onFilter={onFilter} />
        </div>
        <Card className="w-full flex-grow">
          <CardHeader>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>Quản lý danh sách nhân viên.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 w-1/3 min-w-xs">
              <Input
                placeholder="Tìm nhân viên..."
                className="mb-4 w-2/3 flex-grow"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="w-1/3">
                <Select onValueChange={(value) => setSearchBy(value)}>
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
              data={employees || []}
              expandedContent={renderExpandedContent}
              isLoading={listEmployeesData.isLoading}
              pageCount={listEmployeesData.data?.totalPages || 1}
              pageSize={10}
              pageIndex={0}
              onPageChange={(newPage) => setFilter((prev) => ({ ...prev, page: newPage }))}
            />
          </CardContent>
        </Card>
      </div>

      <AddEmployeeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onEmployeeAdded={listEmployeesData.refetch}
      />

      {selectedEmployee && (
        <EditEmployeeDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          employee={selectedEmployee}
          onEmployeeUpdated={listEmployeesData.refetch}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Vô hiệu hóa"
        description={`Bạn có chắc muốn vô hiệu hóa ${selectedEmployee?.fullName}? Hành động này không thể hoàn tác.`}
        confirmText={deleteEmployeeMutation.isPending ? 'Đang xóa' : 'Xóa'}
        cancelText="Hủy"
        onConfirm={() => {
          onDelete();
        }}
      />
    </div>
  );
}
