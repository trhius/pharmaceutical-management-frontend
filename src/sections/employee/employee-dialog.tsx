import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useDebounceForm } from 'src/hooks/use-debounce-form';
//----------------------------------------------------------------------

type EmployeeDialogProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  title: string;
  handleSave: (data: any) => void;
  handleDelete?: (data: any) => void;
};

const form = {
  initialState: {
    name: '',
    description: '',
    status: 'active',
  },
  requiredFields: ['name'],
};

export function EmployeeDialog({
  popupOpen,
  setPopupOpen,
  title,
  handleSave,
  handleDelete,
}: EmployeeDialogProps) {
  const { formData, formError, handleInputChange, isValidForm, resetForm } = useDebounceForm(form);

  useEffect(() => {
    resetForm();
  }, [popupOpen, resetForm]);

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
        variant="standard"
        name="name"
        label="Name"
        value={formData.name}
        error={!!formError.name}
        helperText={formError.name}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <TextField
        fullWidth
        variant="standard"
        name="description"
        label="Description"
        value={formData.description}
        error={!!formError.description}
        helperText={formError.description}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <FormControl
        fullWidth
        sx={{ mb: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}
      >
        <Typography variant="body2">Status</Typography>
        <RadioGroup value={formData.status} name="status" onChange={handleInputChange} row>
          <FormControlLabel value="active" control={<Radio />} label="Active" />
          <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
        {handleDelete && (
          <Button
            fullWidth
            size="medium"
            type="submit"
            color="error"
            variant="contained"
            onClick={() => {
              handleDelete(formData);
              setPopupOpen(false);
            }}
          >
            Delete
          </Button>
        )}
        <Button
          fullWidth
          size="medium"
          type="submit"
          color="primary"
          variant="contained"
          disabled={!isValidForm()}
          onClick={() => {
            handleSave(formData);
            setPopupOpen(false);
          }}
        >
          Save
        </Button>

        <Button
          fullWidth
          size="medium"
          color="inherit"
          variant="contained"
          onClick={() => setPopupOpen(false)}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      aria-labelledby="add-department-title"
      sx={{
        '& .MuiDialog-paper': {
          width: '500px',
          maxWidth: '90%',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography id="add-department-title" variant="h5">
          {title}
        </Typography>
        <Box sx={{ mt: 3 }}>{renderForm}</Box>
      </Box>
    </Dialog>
  );
}
