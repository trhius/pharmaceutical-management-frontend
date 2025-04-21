import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Select } from 'src/components/select/Select';
import { useTable } from 'src/components/table/use-table';
import { CustomTableRow } from 'src/components/table/table-row';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';
import { TableEmptyRows } from 'src/components/table/table-empty-rows';
import { CustomTableToolbar } from 'src/components/table/table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

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

export function EmployeeView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [departmentPopupOpen, setDepartmentPopupOpen] = useState(false);
  const [departmentPopupUpdateOpen, setDepartmentPopupUpdateOpen] = useState(false);
  const [jobTitlePopupOpen, setJobTitlePopupOpen] = useState(false);
  const [jobTitlePopupUpdateOpen, setJobTitlePopupUpdateOpen] = useState(false);
  const [employeePopupOpen, setEmployeePopupOpen] = useState(false);

  const handleSaveDeparment = (data: any) => {
    console.log('Department data:', data);
  };

  const handleSaveJobTitle = (data: any) => {
    console.log('Job title data:', data);
  };

  const notFound = !dataFiltered.length && !!filterName;

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
          Employee
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setEmployeePopupOpen(true)}
        >
          New employee
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Employee status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <FormControlLabel label="Working" control={<Checkbox defaultChecked />} />
              <FormControlLabel label="Quit" control={<Checkbox defaultChecked />} />
            </Box>
          </Card>

          <Select
            title="Department"
            holder="Select department"
            options={['HR', 'Finance', 'Engineering', 'Marketing', 'Sales']}
            selected={selectedDepartments}
            setSelected={setSelectedDepartments}
            handleAddEvent={() => setDepartmentPopupOpen(true)}
            handleEditOption={(option) => {
              setDepartmentPopupUpdateOpen(true);
            }}
          />

          <Select
            title="Job title"
            holder="Select job title"
            options={['Manager', 'Developer', 'Designer', 'Analyst']}
            selected={selectedJobTitles}
            setSelected={setSelectedJobTitles}
            handleAddEvent={() => setJobTitlePopupOpen(true)}
            handleEditOption={(option) => {
              setJobTitlePopupUpdateOpen(true);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 10 }}>
          <Card>
            <CustomTableToolbar
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFilterName(event.target.value);
                table.onResetPage();
              }}
            />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <CustomTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={_users.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        _users.map((user) => user.id)
                      )
                    }
                    headLabel={[
                      { id: 'id', label: 'Employee number' },
                      { id: 'attendance', label: 'Attendance number' },
                      { id: 'name', label: 'Name' },
                      { id: 'phone', label: 'Phone' },
                      { id: 'nationalId', label: 'National ID' },
                      { id: 'debtsAndAdvances', label: 'Debts and advances' },
                      { id: 'note', label: 'Note' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <CustomTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          config={[
                            {
                              field: 'id',
                              render: () => (
                                <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                                  <img
                                    src={row.avatarUrl}
                                    alt={row.id}
                                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                                  />
                                  {row.id.substring(0, 8)}...
                                </Box>
                              ),
                            },
                            {
                              field: 'attendance',
                              width: 100,
                            },
                            {
                              field: 'name',
                            },
                            { field: 'phone' },
                            { field: 'nationalId' },
                            {
                              field: 'debtsAndAdvances',
                              align: 'right',
                            },
                            {
                              field: 'note',
                            },
                          ]}
                        />
                      ))}

                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                    />

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={table.page}
              count={_users.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Card>
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
      <EmployeeCreationForm popupOpen={employeePopupOpen} setPopupOpen={setEmployeePopupOpen}/>
    </DashboardContent>
  );
}
