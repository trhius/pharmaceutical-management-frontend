import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { ROUTES } from 'src/routes/config';
import { useRouter } from 'src/routes/hooks';

import useLogout from 'src/hooks/use-logout';
import { useDebounceForm } from 'src/hooks/use-debounce-form';

import { handleError, showSuccessMessage } from 'src/utils/notify';

import {
  useResetPasswordMutation,
  useVerifyResetPasswordTokenMutation,
} from 'src/app/api/auth/authApiSlice';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

const passwordForm = {
  initialState: {
    password: '',
    confirmPassword: '',
  },
  requiredFields: ['password', 'confirmPassword'],
};

export function ResetPasswordView() {
  const [params] = useSearchParams();

  const token = params.get("token");

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const logout = useLogout();

  const {
    formData: passwordFormData,
    formError: passwordFormError,
    handleInputChange: handlePasswordFormInputChange,
    isValidForm: isValidPasswordForm,
  } = useDebounceForm(passwordForm);

  const [verifyResetPasswordToken] = useVerifyResetPasswordTokenMutation();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    const verifyResetToken = async () => {
      try {
        await verifyResetPasswordToken(token);
      } catch (error) {
        console.log('Verify reset password link error:', error);
        handleError(error, 'Invalid Reset password link!');
        router.push(ROUTES.LOGIN);
      }
    };
    verifyResetToken();
  }, [token, verifyResetPasswordToken, router]);

  const handleUpdatePassword = async () => {
    if (!isValidPasswordForm()) {
      return;
    }

    try {
      const payload = {
        token,
        newPassword: passwordFormData.password,
      };
      await resetPassword(payload).unwrap();
      showSuccessMessage('Updated password successfully!');
    } catch (error) {
      console.log('Reset password Error:', error);
      handleError(error, 'Reset password failed!');
    }

    logout();
  };

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="password"
        placeholder="Password"
        value={passwordFormData.password}
        error={!!passwordFormError.password}
        helperText={passwordFormError.password}
        onChange={handlePasswordFormInputChange}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="confirmPassword"
        placeholder="Confirm password"
        value={passwordFormData.confirmPassword}
        error={!!passwordFormError.confirmPassword}
        helperText={passwordFormError.confirmPassword}
        onChange={handlePasswordFormInputChange}
        type={showConfirmPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify
                    icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography id="dialog" variant="subtitle1" marginBottom={2}>
          Đổi mật khẩu
        </Typography>

        <Box sx={{ width: '100%', typography: 'body1' }}>{renderForm}</Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              // disabled={!isValidForm()}
              onClick={handleUpdatePassword}
            >
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
