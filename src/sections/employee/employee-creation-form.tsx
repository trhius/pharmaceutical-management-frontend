import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import ImageUploader from 'src/components/upload/image-upload';
import { SelectInput } from 'src/components/select/single-select-input';

import { EmployeeSalarySetting } from './employee-salary-setting';
//-------------------------------------------------------
type EmployeeCreationFormProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
};

export function EmployeeCreationForm({ popupOpen, setPopupOpen }: EmployeeCreationFormProps) {
  const [value, setValue] = useState('1');

  const [imageUrl, setImageUrl] = useState<string>('');

  const [openMore, setOpenMore] = useState(false);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    department: '',
    jobTitle: '',
    workingBranch: '',
  });

  const creationForm = (
    <Box sx={{}}>
      <Card sx={{ p: 3, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Basic information
        </Typography>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, sm: 2, md: 2 }}>
            <Box sx={{ width: '220px' }}>
              <ImageUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </Box>
          </Grid>
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 10, md: 10 }}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                name="code"
                label="Employee code"
                placeholder="Auto generated"
                // value={formData.name}
                // error={!!formError.name}
                // helperText={formError.name}
                // onChange={handleInputChange}
                sx={{ mb: 0 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                name="name"
                label="Employee name"
                // value={formData.email}
                // error={!!formError.email}
                // helperText={formError.email}
                // onChange={handleInputChange}
                sx={{ mb: 0 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                name="phone"
                label="Phone number"
                // value={formData.name}
                // error={!!formError.name}
                // helperText={formError.name}
                // onChange={handleInputChange}
                sx={{ mb: 0 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                name="paymentBranch"
                label="Payment branch"
                // value={formData.email}
                // error={!!formError.email}
                // helperText={formError.email}
                // onChange={handleInputChange}
                sx={{ mb: 0 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextField
                fullWidth
                variant="standard"
                name="workingBranch"
                label="Working branch"
                // value={formData.email}
                // error={!!formError.email}
                // helperText={formError.email}
                // onChange={handleInputChange}
                sx={{ mb: 0 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
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
          {openMore ? 'Hide' : 'More'}
        </Button>
      </Box>
      {openMore && (
        <Box>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Working information
            </Typography>
            <Grid container spacing={8}>
              <Grid size={{ xs: 12, sm: 2, md: 2 }} />
              <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 10, md: 10 }}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <DatePicker
                    label="Start working date"
                    slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <SelectInput
                    options={['Option 1', 'Option 2', 'Option 3']}
                    selected={formData.department}
                    setSelected={(val: string | null) =>
                      setFormData({ ...formData, department: val || '' })
                    }
                    handleEditOption={() => {}}
                    handleAddEvent={() => {}}
                    label="Select department"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <SelectInput
                    options={['Option 1', 'Option 2', 'Option 3']}
                    selected={formData.department}
                    setSelected={(val: string | null) =>
                      setFormData({ ...formData, department: val || '' })
                    }
                    handleEditOption={() => {}}
                    handleAddEvent={() => {}}
                    label="Select job title"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <SelectInput
                    options={['Option 1', 'Option 2', 'Option 3']}
                    selected={formData.department}
                    setSelected={(val: string | null) =>
                      setFormData({ ...formData, department: val || '' })
                    }
                    handleEditOption={() => {}}
                    handleAddEvent={() => {}}
                    label="Select login account"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="note"
                    label="Note"
                    // value={formData.email}
                    // error={!!formError.email}
                    // helperText={formError.email}
                    // onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Personal information
            </Typography>
            <Grid container spacing={8}>
              <Grid size={{ xs: 12, sm: 2, md: 2 }} />
              <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 10, md: 10 }}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="idCard"
                    label="ID card number"
                    // value={formData.email}
                    // error={!!formError.email}
                    // helperText={formError.email}
                    // onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <DatePicker
                    label="Date of birth"
                    slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      Gender
                    </Typography>
                    <FormControlLabel label="Male" control={<Checkbox />} />
                    <FormControlLabel label="Female" control={<Checkbox />} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Contact information
            </Typography>
            <Grid container spacing={8}>
              <Grid size={{ xs: 12, sm: 2, md: 2 }} />
              <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 10, md: 10 }}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="address"
                    label="Address"
                    // value={formData.name}
                    // error={!!formError.name}
                    // helperText={formError.name}
                    // onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="province"
                    label="Province"
                    // value={formData.email}
                    // error={!!formError.email}
                    // helperText={formError.email}
                    // onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="email"
                    label="Email"
                    // value={formData.name}
                    // error={!!formError.name}
                    // helperText={formError.name}
                    // onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="district"
                    label="District"
                    // value={formData.email}
                    // error={!!formError.email}
                    // helperText={formError.email}
                    // onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }} />
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="ward"
                    label="Ward"
                    // value={formData.email}
                    // error={!!formError.email}
                    // helperText={formError.email}
                    // onChange={handleInputChange}
                    sx={{ mb: 0 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>
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
          width: '1200px',
          maxWidth: '90%',
          height: '90vh'
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography id="dialog" variant="h5">
          New Employee
        </Typography>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Employee Information" value="1" />
                <Tab label="Salary Settings" value="2" />
              </TabList>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                height: '65vh',
                scrollbarGutter: 'stable'
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              // disabled={!isValidForm()}
              // onClick={handleSignUp}
              // loading={isLoading}
            >
              Save
            </Button>
            <Button
              size="medium"
              color="inherit"
              variant="contained"
              // disabled={!isValidForm()}
              onClick={() => setPopupOpen(false)}
              // loading={isLoading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
