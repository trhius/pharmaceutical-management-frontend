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
      accessorKey: 'branch',
      header: 'Chi nhánh',
    },
    {
      accessorKey: 'role',
      header: 'Chức danh',
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày bắt đầu làm',
    },
    {
      accessorKey: 'note',
      header: 'Ghi chú',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        return (
          <Badge variant={row.original.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {row.original.status === 'ACTIVE' ? 'Active' : 'Inactive'}
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
              <p className="text-sm font-medium">{employee.gender}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Số CMND/CCCD</p>
              <p className="text-sm font-medium">{employee.identityCard}</p>
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Chức danh</p>
              <p className="text-sm font-medium">{employee.role}</p>
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
        title="Employees"
        description="View and manage all employees"
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
            <CardTitle>Employees List</CardTitle>
            <CardDescription>Manage pharmacy employees and their details.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={employees || []}
              searchKey="name"
              searchPlaceholder="Search employees..."
              expandedContent={renderExpandedContent}
            />
          </CardContent>
        </Card>
      </div>

      <AddEmployeeDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {selectedEmployee && (
        <EditEmployeeDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} employee={selectedEmployee} />
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
