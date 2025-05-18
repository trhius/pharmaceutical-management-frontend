import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockResetIcon from '@mui/icons-material/LockReset';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Fallback } from 'src/routes/fallback';

import { useDebounceForm } from 'src/hooks/use-debounce-form';

import { handleError, showSuccessMessage } from 'src/utils/notify';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetAccountInfoQuery,
  useUpdateAccountMutation,
} from 'src/app/api/account/accountApiSlice';

import ImageUploader from 'src/components/upload/image-upload';

import { UpdatePasswordForm } from '../update-password-form';

// ----------------------------------------------------------------
const form = {
  initialState: {
    fullName: '',
    phone: '',
    address: '',
  },
  requiredFields: ['fullName'],
};

export function ProfileView() {
  const [updatePasswordPopupOpen, setUpdatePasswordPopupOpen] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);

  const [imageUrl, setImageUrl] = useState('');

  const { formData, resetForm, formError, handleInputChange, isValidForm } = useDebounceForm(form);

  const { data: accountInfo, isLoading } = useGetAccountInfoQuery({});

  const [updateAccount] = useUpdateAccountMutation();

  useEffect(() => {
    const phoneNumber = accountInfo?.phone?.startsWith('+84')
      ? accountInfo?.phone.slice(3)
      : accountInfo?.phone;
    resetForm({
      fullName: accountInfo?.fullName || '',
      phone: phoneNumber || '',
      address: accountInfo?.address || '',
    });
    setDateOfBirth(dayjs(accountInfo?.dateOfBirth));
  }, [resetForm, accountInfo]);

  const handleUpdateProfile = async () => {
    if (!isValidForm()) {
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        phone: '+84' + formData.phone,
        address: formData.address,
        dateOfBirth,
      };
      await updateAccount(payload).unwrap();
      showSuccessMessage('Updated password successfully!');
    } catch (error) {
      console.log('Reset password Error:', error);
      handleError(error, 'Reset password failed!');
    }
  };

  const renderProfile = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container spacing={3} maxWidth="800px">
        <Grid
          size={{ xs: 12, sm: 4, md: 4 }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Typography id="dialog" variant="h5" marginBottom={2}>
              Người dùng
            </Typography>
            <Box sx={{ width: '220px', borderRadius: '50px' }}>
              <ImageUploader
                imageUrl={imageUrl || '/assets/images/avatar/avatar-25.webp'}
                setImageUrl={setImageUrl}
                hideUploadButton
                size={150}
                disabled
              />
            </Box>
          </Box>

          <Button
            size="medium"
            color="inherit"
            variant="outlined"
            onClick={() => setUpdatePasswordPopupOpen(true)}
            startIcon={<LockResetIcon />}
            sx={{ width: '150px' }}
          >
            Đổi mật khẩu
          </Button>
        </Grid>
        <Grid container spacing={3} size={{ xs: 12, sm: 8, md: 8 }}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography variant="caption">Tên người dùng</Typography>
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
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography variant="caption">Tên đăng nhập</Typography>
            <TextField
              fullWidth
              disabled
              value={accountInfo?.email || ''}
              sx={{ mb: 0 }}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography variant="caption">Điện thoại</Typography>
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
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} display="flex" alignItems="center" gap={2}>
            <Typography variant="caption">Ngày sinh</Typography>
            <DatePicker
              value={dateOfBirth}
              onChange={(value) => setDateOfBirth(value ? dayjs(value).endOf('day') : null)}
              format="DD/MM/YYYY"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography variant="caption">Email</Typography>
            <TextField
              fullWidth
              disabled
              value={accountInfo?.email || ''}
              sx={{ mb: 0 }}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography variant="caption">Địa chỉ</Typography>
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
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                size="medium"
                color="primary"
                variant="contained"
                disabled={!isValidForm()}
                onClick={handleUpdateProfile}
                // loading={isLoading}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <DashboardContent sx={{ backgroundColor: '#f5f5f5' }}>
      {renderProfile}
      <UpdatePasswordForm
        popupOpen={updatePasswordPopupOpen}
        setPopupOpen={setUpdatePasswordPopupOpen}
      />
    </DashboardContent>
  );
}
