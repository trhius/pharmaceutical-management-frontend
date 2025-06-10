import { useCallback, useState } from 'react';
import { PlusCircle } from 'lucide-react'; // Import ListOrdered icon
import useListPageState from '@/hooks/useListPageState';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddEmployeeDialog } from './add-employee-dialog';
import { SortDropdown } from '@/components/ui/sort-dropdown'; // Import SortDropdown
import { EditEmployeeDialog } from './edit-employee-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';
import { FilterEmployee } from './filter-employee';
import { useListEmployees, useDeleteEmployee, useExportEmployees } from '@/apis'; // Import useExportEmployees
import { EmployeeResponse, ListEmployeeRequest } from '@/apis/types';
import { roles, genders, employeeStatuses } from '@/apis/types/transform';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileOutput } from 'lucide-react'; // Import FileOutput icon
import { format } from 'date-fns';

const searchByOptions = [
  { label: 'Tên nhân viên', value: 'NAME' },
  { label: 'Mã nhân viên', value: 'CODE' },
  { label: 'Số điện thoại', value: 'PHONE' },
];

const sortableColumns = [
  { value: 'CODE', label: 'Mã nhân viên' },
  { value: 'NAME', label: 'Tên nhân viên' },
  { value: 'PHONE', label: 'Số điện thoại' },
  { value: 'STATUS', label: 'Trạng thái' },
  { value: 'STORE', label: 'Chi nhánh' },
  { value: 'ROLE', label: 'Chức danh' },
  { value: 'JOIN_DATE', label: 'Ngày bắt đầu làm việc' },
];

export default function EmployeesListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);

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
  } = useListPageState<ListEmployeeRequest>({ initialSize: 10, initialSearchBy: 'NAME' });

  const listEmployeesData = useListEmployees({ sortBy, sortOrder, request: filter });
  const employees = listEmployeesData.data?.content;
  const deleteEmployeeMutation = useDeleteEmployee();
  const exportEmployeesMutation = useExportEmployees(); // Initialize export hook
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isExporting = exportEmployeesMutation.isPending; // Get export loading state

  const handleEdit = (employee: EmployeeResponse) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (employee: EmployeeResponse) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
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

  const onFilter = useCallback(
    (values: Omit<ListEmployeeRequest, 'page' | 'size' | 'search' | 'searchBy' | 'sortBy' | 'sortOrder'>) => {
      // Adjust type definition
      setExternalFilters(values);
    },
    [setExternalFilters]
  );

  // Handle export button click
  const handleExportClick = () => {
    exportEmployeesMutation.mutate(
      { request: filter as ListEmployeeRequest }, // Pass the filtered request
      {
        onSuccess: (blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `DanhSachNhanVien_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast({
            title: 'Xuất dữ liệu thành công',
            description: 'Tệp dữ liệu nhân viên đã được tải xuống.',
          });
        },
        onError: (error) => {
          console.error('Export failed:', error);
          toast({
            title: 'Xuất dữ liệu thất bại',
            description: 'Đã xảy ra lỗi khi xuất dữ liệu nhân viên.',
            variant: 'destructive',
          });
        },
      }
    );
  };

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
          <Badge variant={row.original.status === 'ACTIVE' ? 'success' : 'destructive'}>
            {employeeStatuses.find((status) => status.value === row.original.status)?.label}
          </Badge>
        );
      },
    },
  ];

  const renderExpandedContent = (employee: EmployeeResponse) => {
    return (
      <div className="space-y-4">
        <div className="w-full rounded-md p-2">
          <div className="flex items-center gap-4 mb-6">
            <p className="font-bold text-lg">
              {employee.fullName} - {employee.employeeCode}
            </p>
            <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'destructive'}>
              {employeeStatuses.find((status) => status.value === employee.status)?.label}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Số điện thoại</p>
              <p className="text-sm font-medium">{employee.phone || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{employee.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày sinh</p>
              <p className="text-sm font-medium">
                {employee.dateOfBirth ? format(new Date(employee.dateOfBirth), 'dd/MM/yyyy') : '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Giới tính</p>
              <p className="text-sm font-medium">
                {genders.find((gender) => gender.value === employee.gender)?.label || '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Số CMND/CCCD</p>
              <p className="text-sm font-medium">{employee.identityCard || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Địa chỉ</p>
              <p className="text-sm font-medium">{employee.address || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Chi nhánh làm việc</p>
              <p className="text-sm font-medium">{employee.storeName || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Chức danh</p>
              <p className="text-sm font-medium">{roles.find((role) => role.value === employee.role)?.label || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày bắt đầu làm việc</p>
              <p className="text-sm font-medium">
                {employee.joinDate ? format(new Date(employee.joinDate), 'dd/MM/yyyy') : '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Ngày tạo</p>
              <p className="text-sm font-medium">
                {employee.createdAt ? format(new Date(employee.createdAt), 'dd/MM/yyyy HH:mm') : '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Người tạo</p>
              <p className="text-sm font-medium">{employee.createdBy || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
              <p className="text-sm font-medium">
                {employee.updatedAt ? format(new Date(employee.updatedAt), 'dd/MM/yyyy HH:mm') : '-'}
              </p>
            </div>

            <div className="space-y-1 md:col-span-3">
              <p className="text-xs text-gray-500">Ghi chú</p>
              <p className="text-sm font-medium">{employee.note || '-'}</p>
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
          <div className="flex items-center gap-4">
            {/* Container for sorting dropdown and Add button */}
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </div>
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
            <div className="flex items-center justify-between gap-2 mb-4">
              {' '}
              {/* Added flex container */}
              <div className="flex gap-2 w-1/2 min-w-xs">
                {' '}
                {/* Container for search input and select */}
                <div className="w-1/3 min-w-[150px]">
                  <Select
                    onValueChange={(value) => setSearchByValue(value as ListEmployeeRequest['searchBy'])}
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
                  placeholder="Tìm nhân viên..."
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
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

                {/* Export Button */}
                <Button onClick={handleExportClick} disabled={listEmployeesData.isLoading || isExporting}>
                  <FileOutput className="mr-2 h-4 w-4" /> {/* Added icon */}
                  {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </Button>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={employees || []}
              expandedContent={renderExpandedContent}
              isLoading={listEmployeesData.isLoading}
              pageCount={listEmployeesData.data?.totalPages || 1}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
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
        confirmText={deleteEmployeeMutation.isPending ? 'Đang vô hiệu hóa' : 'Vô hiệu hóa'}
        cancelText="Hủy"
        onConfirm={() => {
          onDelete();
        }}
      />
    </div>
  );
}
