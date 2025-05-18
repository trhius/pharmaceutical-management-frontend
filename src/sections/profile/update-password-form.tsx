import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import useLogout from 'src/hooks/use-logout';
import { useDebounceForm } from 'src/hooks/use-debounce-form';

import { handleError, showSuccessMessage } from 'src/utils/notify';

import { useUpdatePasswordMutation } from 'src/app/api/account/accountApiSlice';

import { Iconify } from 'src/components/iconify';
import { DialogPopup } from 'src/components/popup';

// ----------------------------------------------------------------

type UpdatePasswordFormProps = {
  popupOpen: boolean;
  setPopupOpen: (popupOpen: boolean) => void;
};

const passwordForm = {
  initialState: {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  },
  requiredFields: ['oldPassword', 'newPassword', 'confirmNewPassword'],
};

export function UpdatePasswordForm({ popupOpen, setPopupOpen }: UpdatePasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const logout = useLogout();

  const {
    formData: passwordFormData,
    formError: passwordFormError,
    handleInputChange: handlePasswordFormInputChange,
    isValidForm: isValidPasswordForm,
  } = useDebounceForm(passwordForm);

  const [updatePassword] = useUpdatePasswordMutation();

  const handleUpdatePassword = async () => {
    if (!isValidPasswordForm()) {
      return;
    }

    try {
      const payload = {
        oldPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword,
      };
      await updatePassword(payload).unwrap();
      showSuccessMessage('Updated password successfully!');
      setPopupOpen(false);
      logout();
    } catch (error) {
      console.log('Reset password Error:', error);
      handleError(error, 'Reset password failed!');
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
        name="oldPassword"
        placeholder="Old password"
        value={passwordFormData.oldPassword}
        error={!!passwordFormError.oldPassword}
        helperText={passwordFormError.oldPassword}
        onChange={handlePasswordFormInputChange}
        type={showOldPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                  <Iconify icon={showOldPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="newPassword"
        placeholder="New password"
        value={passwordFormData.newPassword}
        error={!!passwordFormError.newPassword}
        helperText={passwordFormError.newPassword}
        onChange={handlePasswordFormInputChange}
        type={showOldPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                  <Iconify icon={showNewPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="confirmNewPassword"
        placeholder="Confirm new password"
        value={passwordFormData.confirmNewPassword}
        error={!!passwordFormError.confirmNewPassword}
        helperText={passwordFormError.confirmNewPassword}
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
    <DialogPopup
      popupOpen={popupOpen}
      setPopupOpen={setPopupOpen}
      width="400px"
      title="Đổi mật khẩu"
      actions={
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
            disabled={!isValidPasswordForm()}
            onClick={handleUpdatePassword}
            // loading={isLoading}
          >
            Save
          </Button>
          
        </Box>
      }
    >
      {renderForm}
    </DialogPopup>
  );
}
