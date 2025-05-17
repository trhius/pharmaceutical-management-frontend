import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { ROUTES } from 'src/routes/config';
import { useRouter } from 'src/routes/hooks';

import useLogin from 'src/hooks/use-login';
import { useDebounceForm } from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';

import { useLoginMutation } from 'src/app/api/auth/authApiSlice';

import { Iconify } from 'src/components/iconify';

import { ForgotPasswordView } from '../forgot-password-view';

// ----------------------------------------------------------------------
const form = {
  initialState: {
    email: '',
    password: '',
  },
  requiredFields: ['email', 'password'],
};

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [forgotPasswordPopupOpen, setForgotPasswordOpen] = useState(false);

  const { formData, formError, handleInputChange, isValidForm } = useDebounceForm(form);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = useLogin();

  const handleSignIn = async () => {
    if (!isValidForm()) {
      return;
    }

    try {
      const data = await login(formData).unwrap();
      if (!data) {
        return;
      }

      handleLogin(data);
      console.log('Login successful:', data);

      router.push(ROUTES.INDEX);
    } catch (error) {
      console.log('Login error:', error);
      handleError(error, 'Login failed!');
    }
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
        size="medium"
        name="email"
        label="Email"
        value={formData.email}
        error={!!formError.email}
        helperText={formError.email}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <TextField
        fullWidth
        size="medium"
        name="password"
        label="Password"
        value={formData.password}
        error={!!formError.password}
        helperText={formError.password}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSignIn();
          }
        }}
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

      <Link
        variant="body2"
        color="inherit"
        sx={{ mb: 1.5 }}
        onClick={() => setForgotPasswordOpen(true)}
      >
        Forgot password?
      </Link>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={!isValidForm()}
        onClick={handleSignIn}
        loading={isLoading}
      >
        Sign in
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
      </Box>
      {renderForm}
      <ForgotPasswordView
        popupOpen={forgotPasswordPopupOpen}
        setPopupOpen={setForgotPasswordOpen}
      />
    </>
  );
}
