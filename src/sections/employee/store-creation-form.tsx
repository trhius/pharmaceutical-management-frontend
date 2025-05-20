import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useDebounceForm } from 'src/hooks/use-debounce-form';

import { handleError, showSuccessMessage } from 'src/utils/notify';

import {
  useCreateStoreMutation,
  useDeleteStoreMutation,
  useUpdateStoreMutation,
} from 'src/app/api/store/storeApiSlice';
//----------------------------------------------------------------------

type StoreStatus = 'ACTIVE' | 'INACTIVE'; // Assuming these are the possible status values

type Store = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: StoreStatus;
};

type StoreCreationFormProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  title: string;
  editData?: Store;
};

const form = {
  initialState: {
    name: '',
    phone: '',
    email: '',
    address: '',
    status: 'ACTIVE',
  },
  requiredFields: ['name'],
};

export function StoreCreationForm({
  popupOpen,
  setPopupOpen,
  title,
  editData,
}: StoreCreationFormProps) {
  const { formData, formError, handleInputChange, isValidForm, resetForm } = useDebounceForm(form);
  const [createStore] = useCreateStoreMutation();
  const [updateStore] = useUpdateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();

  useEffect(() => {
    resetForm(editData);
  }, [popupOpen, resetForm, editData]);

  const handleSave = async () => {
    if (editData) {
      try {
        await updateStore({ id: editData.id, payload: formData }).unwrap();
        showSuccessMessage("Update store successfully!")
      } catch (error) {
        handleError(error, 'Update store failed!');
      }
    } else {
      try {
        await createStore(formData).unwrap();
        showSuccessMessage("Create store successfully!")
      } catch (error) {
        handleError(error, 'Create store failed!');
      }
    }
  };

  const handleDelete = async () => {
    if (editData) {
      try {
        await deleteStore(editData.id).unwrap();
        showSuccessMessage("Delete store successfully!")
      } catch (error) {
        handleError(error, 'Delete store failed!');
      }
    }
  };
  console.log(isValidForm());
  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography variant="caption">
          Tên Chi nhánh
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        </Typography>
        <TextField
          fullWidth
          name="name"
          value={formData.name}
          error={!!formError.name}
          helperText={formError.name}
          onChange={handleInputChange}
          sx={{ mb: 0 }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Box>

      <Box sx={{ width: '100%' }}>
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
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="caption">Email</Typography>
        <TextField
          fullWidth
          type="email"
          name="email"
          value={formData.email}
          error={!!formError.email}
          helperText={formError.email}
          onChange={handleInputChange}
          sx={{ mb: 0 }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="caption">Address</Typography>
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
      </Box>

      <FormControl
        fullWidth
        sx={{ mb: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}
      >
        <Typography variant="body2">Status</Typography>
        <RadioGroup value={formData.status} name="status" onChange={handleInputChange} row>
          <FormControlLabel value="ACTIVE" control={<Radio />} label="Active" />
          <FormControlLabel value="INACTIVE" control={<Radio />} label="Inactive" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
        {editData && (
          <Button
            fullWidth
            size="medium"
            type="submit"
            color="error"
            variant="contained"
            onClick={() => {
              handleDelete();
              setPopupOpen(false);
            }}
          >
            Delete
          </Button>
        )}

        <Button
          fullWidth
          size="medium"
          color="inherit"
          variant="contained"
          onClick={() => setPopupOpen(false)}
        >
          Cancel
        </Button>
        
        <Button
          fullWidth
          size="medium"
          type="submit"
          color="primary"
          variant="contained"
          disabled={!isValidForm()}
          onClick={() => {
            handleSave();
            setPopupOpen(false);
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      aria-labelledby="store-creation-form-title"
      sx={{
        '& .MuiDialog-paper': {
          width: '500px',
          maxWidth: '90%',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography id="store-creation-form-title" variant="h5" textAlign="center">
          {title}
        </Typography>
        <Box sx={{ mt: 1 }}>{renderForm}</Box>
      </Box>
    </Dialog>
  );
}
