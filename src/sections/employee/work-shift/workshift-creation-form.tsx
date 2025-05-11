import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

//-------------------------------------------------------

type WorkshiftCreationFormProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
};

export function WorkshiftCreationForm({ popupOpen, setPopupOpen }: WorkshiftCreationFormProps) {

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
      <Grid container spacing={3}>
        <Grid container spacing={8} size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ xs: 12, sm: 3, md: 3 }} display="flex" alignItems="center">
            <Typography>Tên</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 9, md: 9 }}>
            <TextField
              fullWidth
              variant="standard"
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
        </Grid>
        <Grid container spacing={8} size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ xs: 12, sm: 3, md: 3 }} display="flex" alignItems="center">
              <Typography>Giờ làm việc</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 9, md: 9 }}>
            <Stack direction="row" gap={3} alignItems="center">
              <TimePicker
              // value={value}
              // onChange={(newValue) => setValue(newValue)}
              />
              <Typography>Đến</Typography>

              <TimePicker
              // value={value}
              // onChange={(newValue) => setValue(newValue)}
              />
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={8} size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ xs: 12, sm: 3, md: 3 }} display="flex" alignItems="center">
              <Typography>Giờ được phép chấm công</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 9, md: 9 }}>
            <Stack direction="row" gap={3} alignItems="center">
              <TimePicker
              // value={value}
              // onChange={(newValue) => setValue(newValue)}
              />
              <Typography>Đến</Typography>

              <TimePicker
              // value={value}
              // onChange={(newValue) => setValue(newValue)}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      aria-labelledby="dialog"
      sx={{
        '& .MuiDialog-paper': {
          width: '800px',
          maxWidth: '90%',
          height: '50vh',
          display: 'flex', // make dialog paper flex
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography id="dialog" variant="h5">
          Thêm ca làm việc
        </Typography>

        <Divider />

        <Box sx={{ mt: 4, width: '100%', typography: 'body1' }}>{creationForm}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button size="medium" color="primary" variant="contained">
              Save
            </Button>
            <Button
              size="medium"
              color="inherit"
              variant="contained"
              onClick={() => setPopupOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
