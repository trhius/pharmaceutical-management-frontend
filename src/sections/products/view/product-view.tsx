import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { DTable } from 'src/components/table/table';
import { SelectInput } from 'src/components/select/single-select-input';

import { CustomerCreationForm } from '../product-creation-form';
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

export function ProductView() {
  const [employeePopupOpen, setEmployeePopupOpen] = useState(false);

  return (
    <DashboardContent sx={{ backgroundColor: '#f5f5f5' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Hàng hóa
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 10 }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <OutlinedInput
              fullWidth
              placeholder="Search ..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ maxWidth: 320 }}
            />
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setEmployeePopupOpen(true)}
            >
              Tạo mới
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Ngày tạo
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, gap: 2 }}>
              <DatePicker label="Từ" />
              <DatePicker label="Tới" />
            </Box>
          </Card>

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Nhà cung cấp
            </Typography>
            <Box>
              <SelectInput
                options={['Option 1', 'Option 2', 'Option 3']}
                selected=""
                setSelected={() => ({})}
                // selected={formData.department}
                // setSelected={(val: string | null) =>
                //   setFormData({ ...formData, department: val || '' })
                // }
                handleEditOption={() => {}}
                handleAddEvent={() => {}}
              />
            </Box>
          </Card>

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Loại hàng
            </Typography>
            <Box>
              <SelectInput
                options={['Option 1', 'Option 2', 'Option 3']}
                selected=""
                setSelected={() => ({})}
                // selected={formData.department}
                // setSelected={(val: string | null) =>
                //   setFormData({ ...formData, department: val || '' })
                // }
                handleEditOption={() => {}}
                handleAddEvent={() => {}}
              />
            </Box>
          </Card>

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Giá bán
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, gap: 2 }}>
              <TextField
                type="number"
                placeholder="Nhập giá trị"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">Từ</InputAdornment>,
                  },
                }}
              />
              <TextField
                type="number"
                placeholder="Nhập giá trị"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">Tới</InputAdornment>,
                  },
                }}
              />
            </Box>
          </Card>

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Trạng thái
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel label="Tất cả" control={<Checkbox defaultChecked />} />
              <FormControlLabel label="Hoạt động" control={<Checkbox />} />
              <FormControlLabel label="Ngừng hoạt động" control={<Checkbox />} />
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 10 }}>
          <DTable
            data={[]}
            headerConfigs={[
              { id: 'id', label: 'Mã hàng' },
              { id: 'name', label: 'Tên hàng' },
              { id: 'phone', label: 'Tên viết tắt' },
              { id: 'nationalId', label: 'Giá bán' },
              { id: 'debtsAndAdvances', label: 'Giá vốn' },
              { id: 'inventory', label: 'Tồn kho' },
              { id: 'createdAt', label: 'Thời gian tạo' },
              { id: '' },
            ]}
            rowConfigs={[
              {
                field: 'id',
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
                field: 'inventory',
                align: 'right',
              },
              {
                field: 'createdAt',
              },
            ]}
          />
        </Grid>
      </Grid>

      <CustomerCreationForm popupOpen={employeePopupOpen} setPopupOpen={setEmployeePopupOpen} />
    </DashboardContent>
  );
}
