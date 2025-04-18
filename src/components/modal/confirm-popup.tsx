import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ModalPopup from './modal';

//----------------------------------------------------------------------

type ConfirmPopupContent = {
  title: string;
  message: string;
  cancelBtnText: string;
  confirmBtnText: string;
};

type ConfirmPopupProps = {
  content: ConfirmPopupContent;
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  handleCancel: () => void;
  handleConfirm: () => void;
};

const ConfirmPopup = ({
  content,
  popupOpen,
  setPopupOpen,
  handleCancel,
  handleConfirm,
}: ConfirmPopupProps) => (
  <ModalPopup
    open={popupOpen}
    setOpen={setPopupOpen}
    sx={{ width: { xs: '95%', sm: 500 }, top: '45%' }}
  >
    <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
      {content.title}
    </Typography>
    <Typography variant="body1">{content.message}</Typography>
    <Stack direction="row" justifyContent="space-evenly">
      <Button
        size="large"
        variant="contained"
        color="inherit"
        onClick={handleCancel}
        sx={{ mt: 3, width: { xs: '40%', sm: '200px' } }}
      >
        {content.cancelBtnText}
      </Button>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={handleConfirm}
        sx={{ mt: 3, width: { xs: '40%', sm: '200px' } }}
      >
        {content.confirmBtnText}
      </Button>
    </Stack>
  </ModalPopup>
);

export default ConfirmPopup;
