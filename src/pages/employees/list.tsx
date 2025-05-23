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
import { useListEmployees } from '@/apis';
import { EmployeeResponse, ListEmployeeRequest } from '@/apis/types';
import { roles, genders, employeeStatuses } from '@/apis/types/transform';
import { Input } from '@/components/ui/input';

export default function EmployeesListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);

  // const { data: employees } = useQuery({
  //   queryKey: ['employees'],
  //   queryFn: async () => {
  //     return new Promise<typeof employeesData>((resolve) => {
  //       setTimeout(() => resolve(employeesData), 500);
  //     });
  //   },
  // });
  const [filter, setFilter] = useState<ListEmployeeRequest>({});
  const listEmployeesData = useListEmployees({ request: filter });
  const employees = listEmployeesData.data?.content;

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
    setFilter({ ...filter, ...applyFilter });
  };

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
              <p className="text-sm font-medium">{employee.note}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleEdit(employee)}>
              Edit Details
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(employee)}>
              Delete
            </Button>
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
            Add Employee
          </Button>
        }
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div className="sticky top-8">
          <FilterEmployee onFilter={onFilter} />
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>Quản lý danh sách nhân viên.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Tìm nhân viên..."
              className="mb-4 w-fit"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <DataTable
              columns={columns}
              data={employees || []}
              expandedContent={renderExpandedContent}
              isLoading={listEmployeesData.isLoading}
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
        title="Delete Employee"
        description={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
        onConfirm={() => {
          // Handle deletion
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}
