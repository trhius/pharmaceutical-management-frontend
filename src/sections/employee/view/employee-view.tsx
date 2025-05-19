import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Fallback } from 'src/routes/fallback';

import { useFilter } from 'src/hooks/useFilter';

import { fDate, fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetEmployeesQuery } from 'src/app/api/employee/employeeApiSlice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { DTable } from 'src/components/table/table';
import { Select as AutocompleteSelect } from 'src/components/select/autocomplete-select';

import { EmployeeDialog } from '../employee-dialog';
import { EmployeeCreationForm } from '../employee-creation-form';
// ----------------------------------------------------------------------
export type UserProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

export type Employee = {
  id: number;
  employeeCode: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  storeId: number | null;
  storeName: string | null;
  storeAddress: string | null;
  address: string;
  dateOfBirth: string;
  identityCard: string | null;
  joinDate: string | null;
  gender: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

const EMPLOYEE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const ROLE_CONFIG = [
  { key: 'SUPER_ADMIN', value: 'Super admin' },
  { key: 'STORE_MANAGER', value: 'Store manager' },
  { key: 'PHARMACIST', value: 'Pharmacist' },
  { key: 'INVENTORY_STAFF', value: 'Inventory staff' },
];

export function EmployeeView() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [status, setStatus] = useState<string[]>([]);
  const [role, setRole] = useState<any>();

  const { getAllFilters, updateFilters } = useFilter();

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [departmentPopupOpen, setDepartmentPopupOpen] = useState(false);
  const [departmentPopupUpdateOpen, setDepartmentPopupUpdateOpen] = useState(false);
  const [jobTitlePopupOpen, setJobTitlePopupOpen] = useState(false);
  const [jobTitlePopupUpdateOpen, setJobTitlePopupUpdateOpen] = useState(false);
  const [employeePopupOpen, setEmployeePopupOpen] = useState(false);

  const filters = getAllFilters();

  console.log(filters);

  const { data: employeesData, isLoading } = useGetEmployeesQuery({
    ...filters,
    page: filters?.page ? Number(filters?.page) - 1 : 0,
  });

  useEffect(() => {
    setEmployees(employeesData?.content);
  }, [employeesData]);

  useEffect(() => {
    if (status && status.length === 1) {
      updateFilters({ status: status[0] });
    } else {
      updateFilters({ status: '' });
    }
  }, [status, updateFilters]);

  const handleSaveDeparment = (data: any) => {
    console.log('Department data:', data);
  };

  const handleSaveJobTitle = (data: any) => {
    console.log('Job title data:', data);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <DashboardContent sx={{ backgroundColor: '#f5f5f5' }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Nhân Viên
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setEmployeePopupOpen(true)}
        >
          Tạo mới
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Trạng thái nhân viên
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <FormControlLabel
                label="Đang làm việc"
                control={
                  <Checkbox
                    checked={status?.includes(EMPLOYEE_STATUS.ACTIVE)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStatus((prev) => [...(prev || []), EMPLOYEE_STATUS.ACTIVE]);
                      } else {
                        setStatus((prev) => prev?.filter((s) => s !== EMPLOYEE_STATUS.ACTIVE));
                      }
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Đã nghỉ"
                control={
                  <Checkbox
                    checked={status?.includes(EMPLOYEE_STATUS.INACTIVE)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStatus((prev) => [...(prev || []), EMPLOYEE_STATUS.INACTIVE]);
                      } else {
                        setStatus((prev) => prev?.filter((s) => s !== EMPLOYEE_STATUS.INACTIVE));
                      }
                    }}
                  />
                }
              />
            </Box>
          </Card>

          <AutocompleteSelect
            title="Chi nhánh"
            // holder="Select department"
            options={['HR', 'Finance', 'Engineering', 'Marketing', 'Sales']}
            selected={selectedDepartments}
            setSelected={setSelectedDepartments}
            handleAddEvent={() => setDepartmentPopupOpen(true)}
            handleEditOption={(option) => {
              setDepartmentPopupUpdateOpen(true);
            }}
          />

          <AutocompleteSelect
            title="Chức danh"

            // holder="Select job title"
            options={ROLE_CONFIG}
            selected={role}
            setSelected={setRole}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 10 }}>
          <DTable
            customSearchKeyword="commonSearchBy"
            customSearchOptions={[
              { key: 'NAME', value: 'Tên nhân viên' },
              { key: 'CODE', value: 'Mã nhân viên' },
            ]}
            data={employees}
            totalPages={employeesData?.totalPages}
            headerConfigs={[
              { id: 'employeeCode', label: 'Mã nhân viên' },
              { id: 'fullName', label: 'Tên nhân viên' },
              { id: 'email', label: 'Email' },
              { id: 'storeName', label: 'Chi nhánh làm việc' },
              { id: 'role', label: 'Chức danh' },
              { id: 'status', label: 'Trạng thái' },
              { id: 'createdAt', label: 'Ngày bắt đầu làm' },
              { id: '' },
            ]}
            rowConfigs={[
              {
                field: 'code',
                render: (row: Employee) => (
                  <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                    {/* <img
                              src={row.avatarUrl}
                              alt={row.id}
                              style={{ width: 40, height: 40, borderRadius: '50%' }}
                            /> */}
                    {row?.employeeCode}
                  </Box>
                ),
              },
              { field: 'fullName' },
              {
                field: 'email',
                render: (row: Employee) => (
                  <Tooltip title={row?.email}>
                    <Box>{row?.email?.substring(0, 20)}...</Box>
                  </Tooltip>
                ),
              },
              { field: 'storeName' },
              { field: 'role' },
              {
                field: 'status',
                render: (row: Employee) => (
                  <Label color={(row.status === 'INACTIVE' && 'error') || 'success'}>
                    {row.status}
                  </Label>
                ),
              },
              {
                field: 'createdAt',
                render: (row: Employee) => (
                  <Tooltip title={fDateTime(row?.createdAt)}>
                    <Box>{fDate(row?.createdAt)}</Box>
                  </Tooltip>
                ),
              },
            ]}
            toolbar
          />
        </Grid>
      </Grid>
      <EmployeeDialog
        popupOpen={departmentPopupOpen}
        setPopupOpen={setDepartmentPopupOpen}
        title="New Department"
        handleSave={handleSaveDeparment}
      />
      <EmployeeDialog
        popupOpen={departmentPopupUpdateOpen}
        setPopupOpen={setDepartmentPopupUpdateOpen}
        title="Update Department"
        handleSave={handleSaveDeparment}
        handleDelete={handleSaveDeparment}
      />
      <EmployeeDialog
        popupOpen={jobTitlePopupOpen}
        setPopupOpen={setJobTitlePopupOpen}
        title="New Job Title"
        handleSave={handleSaveJobTitle}
      />
      <EmployeeDialog
        popupOpen={jobTitlePopupUpdateOpen}
        setPopupOpen={setJobTitlePopupUpdateOpen}
        title="New Job Title"
        handleSave={handleSaveJobTitle}
      />
      <EmployeeCreationForm popupOpen={employeePopupOpen} setPopupOpen={setEmployeePopupOpen} />
    </DashboardContent>
  );
}
