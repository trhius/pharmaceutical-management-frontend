import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useDebounceForm } from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';

import { useRequestResetPasswordMutation } from 'src/app/api/auth/authApiSlice';

// ----------------------------------------------------------------------
const emailForm = {
  initialState: {
    email: '',
  },
  requiredFields: ['email'],
};

type ForgotPasswordProps = {
  popupOpen: boolean;
  setPopupOpen: (popupOpen: boolean) => void;
};

export function ForgotPasswordView({ popupOpen, setPopupOpen }: ForgotPasswordProps) {
  const [step, setStep] = useState(1);

  const {
    formData: emailFormData,
    formError: emailFormError,
    handleInputChange: handleEmailFormInputChange,
    isValidForm: isValidEmailForm,
    resetForm: resetEmailForm,
  } = useDebounceForm(emailForm);

  const [requestResetPassword] = useRequestResetPasswordMutation();

  useEffect(() => {
    if (!popupOpen) {
      setStep(1);
      resetEmailForm();
    }
  }, [popupOpen, resetEmailForm]);

  const handleRequestResetPassword = async () => {
    if (!isValidEmailForm()) {
      return;
    }

    try {
      await requestResetPassword(emailFormData);
    } catch (error) {
      console.log('Request reset password Error:', error);
      handleError(error, 'Request reset password failed!');
    }

    setStep(3);
  };

  const step1 = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="email"
        placeholder="Nhập email"
        value={emailFormData.email}
        error={!!emailFormError.email}
        helperText={emailFormError.email}
        onChange={handleEmailFormInputChange}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
    </Box>
  );

  const step2 = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <Typography variant="body2">Bạn cần có mã xác thực để đặt lại mật khẩu.</Typography>
      <Typography variant="body2">Bấm vào gửi mã xác thực để nhận mã.</Typography>
    </Box>
  );

  const step3 = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <Typography variant="body2">
        Chúng tôi đã gửi một liên kết để đặt lại mật khẩu của bạn. Hãy kiểm tra hộp thư đến và làm
        theo hướng dẫn trong email.
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      aria-labelledby="dialog"
      sx={{
        '& .MuiDialog-paper': {
          width: '400px',
          maxWidth: '90%',
          maxHeight: '90vh',
          display: 'flex', // make dialog paper flex
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ py: 2, px: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography id="dialog" variant="subtitle1" marginBottom={2}>
          Quên mật khẩu
        </Typography>

        <Box sx={{ width: '100%', typography: 'body1', position: 'relative', minHeight: '80px' }}>
          <Fade in={step === 1} unmountOnExit>
            <Box position="absolute" width="100%">
              {step1}
            </Box>
          </Fade>
          <Fade in={step === 2} unmountOnExit>
            <Box position="absolute" width="100%">
              {step2}
            </Box>
          </Fade>
          <Fade in={step === 3} unmountOnExit>
            <Box position="absolute" width="100%">
              {step3}
            </Box>
          </Fade>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ px: 3, py: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {step !== 3 && (
              <Button
                size="medium"
                color="inherit"
                variant="contained"
                // disabled={!isValidForm()}
                onClick={() => {
                  if (step === 1) {
                    setPopupOpen(false);
                    return;
                  }
                  if (step === 2 || step === 3) {
                    const previousStep = step - 1;
                    setStep(previousStep);
                  }
                }}
              >
                Trở về
              </Button>
            )}
            {step === 1 && (
              <Button
                size="medium"
                color="primary"
                variant="contained"
                disabled={!isValidEmailForm()}
                onClick={() => setStep(2)}
              >
                Lấy mật khẩu
              </Button>
            )}

            {step === 2 && (
              <Button
                size="medium"
                color="primary"
                variant="contained"
                // disabled={!isValidForm()}
                onClick={handleRequestResetPassword}
                // loading={isLoading}
              >
                Gửi mã xác thực
              </Button>
            )}

            {step === 3 && (
              <Button
                size="medium"
                color="primary"
                variant="contained"
                // disabled={!isValidForm()}
                onClick={() => setPopupOpen(false)}
              >
                Hoàn tất
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
