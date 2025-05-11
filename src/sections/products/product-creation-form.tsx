import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import ImageUploader from 'src/components/upload/image-upload';
import { SelectInput } from 'src/components/select/single-select-input';
//-------------------------------------------------------
type CustomerCreationFormProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
};

export function CustomerCreationForm({ popupOpen, setPopupOpen }: CustomerCreationFormProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  const [openMore, setOpenMore] = useState(false);

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
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={3}>
          <Grid container spacing={1} size={{ xs: 12, sm: 5, md: 5 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography variant="caption">Tên khách hàng</Typography>
              <TextField
                fullWidth
                name="name"
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
            <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="caption">Điện thoại 1</Typography>
                <TextField
                  fullWidth
                  name="phone1"
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
                <Typography variant="caption">Điện thoại 2</Typography>
                <TextField
                  fullWidth
                  name="phone2"
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
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography variant="caption">Email</Typography>
              <TextField
                fullWidth
                placeholder="email@gmail.com"
                name="email"
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
          <Grid container spacing={1} size={{ xs: 12, sm: 5, md: 5 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography variant="caption">Mã khách hàng</Typography>
              <TextField
                fullWidth
                name="name"
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
            <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="caption">Sinh nhật</Typography>
                <DatePicker />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Typography variant="caption">Giới tính</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel label="Nam" control={<Checkbox />} />
                  <FormControlLabel label="Nữ" control={<Checkbox />} />
                </Box>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography variant="caption">Facebook</Typography>
              <TextField
                fullWidth
                placeholder="https://www.facebook.com/username"
                name="email"
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
          <Grid container spacing={2} size={{ xs: 12, sm: 2, md: 2 }}>
            <Typography variant="caption">Ảnh khách hàng</Typography>
            <Box sx={{ width: '220px' }}>
              <ImageUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Card sx={{ p: 2 , mb: 3, mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Địa chỉ
        </Typography>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography variant="caption">Địa chỉ</Typography>
            <TextField
              fullWidth
              name="address"
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
          <Grid container  size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant="caption">Tỉnh/Thành phố</Typography>
              <TextField
                fullWidth
                name="province"
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

            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant="caption">Quận/Huyện</Typography>
              <TextField
                fullWidth
                name="district"
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
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant="caption">Phường/Xã</Typography>
              <TextField
                fullWidth
                name="ward"
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
  );

  return (
    <Dialog
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      aria-labelledby="dialog"
      sx={{
        '& .MuiDialog-paper': {
          width: '1000px',
          maxWidth: '90%',
          maxHeight: '90vh',
          display: 'flex', // make dialog paper flex
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography id="dialog" variant="h5" marginBottom={2}>
          Tạo khách hàng mới
        </Typography>

        <Box sx={{ width: '100%', typography: 'body1' }}>{creationForm}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
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
