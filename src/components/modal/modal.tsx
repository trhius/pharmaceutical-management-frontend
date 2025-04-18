import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';

type ModalPopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  sx?: object;
};

export default function ModalPopup({ open, setOpen, children, sx }: ModalPopupProps) {
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Card
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: {xs: "95%", sm: 600},
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              maxHeight: '95%',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              ...sx
            }}
          >
            {children}
          </Card>
        </Fade>
      </Modal>
    </Box>
  );
}