import { ChangeEvent, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import TabList from '@mui/lab/TabList';
import { Divider } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useDebounceForm } from 'src/hooks/use-debounce-form';

import { RoleSelect } from 'src/components/select/role-select';
import { StoreSelect } from 'src/components/select/store-select';

import { EmployeeSalarySetting } from './employee-salary-setting';

//-------------------------------------------------------

type EmployeeCreationFormProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
};

const employeeForm = {
  initialState: {
    fullName: '',
    email: '',
    phone: '',
    identityCardNo: '',
    address: '',
    note: '',
  },
  requiredFields: [],
};

export function EmployeeCreationForm({ popupOpen, setPopupOpen }: EmployeeCreationFormProps) {
  const [value, setValue] = useState('1');

  const [store, setStore] = useState<any>({});
  const [storeError, setStoreError] = useState<string>('');
  const [role, setRole] = useState<any>({});
  const [roleError, setRoleError] = useState<string>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');

  const [openMore, setOpenMore] = useState(false);

  const { formData, formError, handleInputChange, setFormError, isValidForm, resetForm } =
    useDebounceForm(employeeForm);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const isValidEmployee = () => {
    if (!store?.value) {
      setStoreError('Store is required!');
    }

    if (!role?.value) {
      setRoleError('Role is required!');
    }

    if (!store || !role) {
      return false;
    }

    return isValidForm();
  };

  const handleCreateEmployee = () => {
    if (!isValidEmployee()) {
      return;
    }
  };

  const creationForm = (
    <Box sx={{}}>
      <Card sx={{ px: 10, pt: 3, pb: 6, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Thông tin cơ bản
        </Typography>

        <Grid container spacing={2} columnSpacing={6} size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Typography variant="caption" sx={{ mb: 1 }}>
              Mã nhân viên
            </Typography>
            <TextField
              fullWidth
              name="employeeCode"
              placeholder="Auto generated"
              disabled
              sx={{ mb: 0 }}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Typography variant="caption" sx={{ mb: 1 }}>
              Tên nhân viên
            </Typography>
            <TextField
              fullWidth
              name="fullName"
              value={formData.fullName}
              error={!!formError.fullName}
              helperText={formError.fullName}
              onChange={handleInputChange}
              sx={{ mb: 0 }}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ mb: 1 }}>
                Điện thoại
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="phone"
                value={formData.phone}
                error={!!formError.phone}
                helperText={formError.phone}
                onChange={handleInputChange}
                sx={{ mb: 0 }}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: <InputAdornment position="start">+84</InputAdornment>,
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Typography variant="caption" sx={{ mb: 1 }}>
              Chi nhánh làm việc
            </Typography>
            <StoreSelect
              store={store}
              setStore={setStore}
              inputStyle
              error={storeError}
              setError={setStoreError}
            />
          </Grid>
        </Grid>
      </Card>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="outlined"
          color="inherit"
          sx={{ mb: 2 }}
          onClick={() => setOpenMore(!openMore)}
        >
          {openMore ? 'Ẩn thông tin' : 'Hiện thông tin'}
        </Button>
      </Box>
      {openMore && (
        <Box>
          <Card sx={{ px: 10, pt: 3, pb: 6, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Thông tin công việc
            </Typography>

            <Grid container spacing={2} columnSpacing={6} size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  Ngày bắt đầu làm việc
                </Typography>
                <DatePicker slotProps={{ textField: { fullWidth: true } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  Chức danh
                </Typography>
                <RoleSelect
                  role={role}
                  setRole={setRole}
                  inputStyle
                  error={roleError}
                  setError={setRoleError}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  Ghi chú
                </Typography>
                <TextField
                  fullWidth
                  name="note"
                  value={formData.note}
                  error={!!formError.note}
                  helperText={formError.note}
                  onChange={handleInputChange}
                  sx={{ mb: 0 }}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Card>
          <Card sx={{ px: 10, pt: 3, pb: 6, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Thông tin cá nhân
            </Typography>

            <Grid container spacing={2} columnSpacing={6} size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  Số CMND/CCCD
                </Typography>
                <TextField
                  fullWidth
                  name="identityCardNo"
                  value={formData.identityCardNo}
                  error={!!formError.identityCardNo}
                  helperText={formError.identityCardNo}
                  onChange={handleInputChange}
                  sx={{ mb: 0 }}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  Ngày sinh
                </Typography>
                <DatePicker slotProps={{ textField: { fullWidth: true } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ mr: 2 }}>
                    Gender
                  </Typography>
                  <FormControlLabel
                    label="Male"
                    control={
                      <Checkbox
                        checked={gender === 'MALE'}
                        onChange={(e: ChangeEvent, checked) => {
                          if (checked) setGender('MALE');
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Female"
                    control={
                      <Checkbox
                        checked={gender === 'FEMALE'}
                        onChange={(e: ChangeEvent, checked) => {
                          if (checked) setGender('FEMALE');
                        }}
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="caption">Address</Typography>
                  <TextField
                    fullWidth
                    name="address"
                    value={formData.address}
                    error={!!formError.address}
                    helperText={formError.address}
                    onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}
    </Box>
  );

  return (
    <Dialog
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      aria-labelledby="dialog"
      sx={{
        '& .MuiDialog-paper': {
          width: '800px',
          maxWidth: '90%',
          height: '90vh',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography id="dialog" variant="h5">
          Tạo nhân viên
        </Typography>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Thông tin nhân viên" value="1" />
                <Tab label="Thiết lập lương" value="2" />
              </TabList>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                height: '65vh',
                scrollbarGutter: 'stable',
              }}
            >
              <TabPanel value="1" sx={{ px: 1 }}>
                {creationForm}
              </TabPanel>
              <TabPanel value="2" sx={{ px: 1 }}>
                <EmployeeSalarySetting />
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              size="medium"
              color="inherit"
              variant="contained"
              onClick={() => setPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              disabled={!isValidForm()}
              onClick={handleCreateEmployee}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
