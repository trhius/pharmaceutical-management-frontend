import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// ---------------------------------------------------------

type DialogPopupProps = {
  popupOpen: boolean;
  setPopupOpen: (popupOpen: boolean) => void;
  width: string;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
};

export function DialogPopup({
  popupOpen,
  setPopupOpen,
  width,
  title,
  children,
  actions,
}: DialogPopupProps) {
  return (
    <Dialog
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      aria-labelledby="dialog"
      sx={{
        '& .MuiDialog-paper': {
          width,
          maxWidth: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ py: 2, px: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography id="dialog" variant="subtitle1" marginBottom={2}>
          {title}
        </Typography>

        <Box sx={{ width: '100%', typography: 'body1', position: 'relative', minHeight: '80px' }}>
          {children}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ px: 3, py: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>{actions}</Box>
      </Box>
    </Dialog>
  );
}
