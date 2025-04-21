import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';

import { Iconify } from 'src/components/iconify';

//--------------------------------------

type SelectInputProps = {
  label: string;
  options: string[];
  selected: string;
  setSelected: (value: string | null) => void;
  handleAddEvent: () => void;
  handleEditOption?: (option: string) => void;
};

export function SelectInput({
  label,
  options,
  selected,
  setSelected,
  handleAddEvent,
  handleEditOption,
}: SelectInputProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Autocomplete
        options={options}
        value={selected}
        onChange={(event, newValue) => setSelected(newValue)}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
        
          return (
            <Box
              component="li"
              key={key}
              {...rest}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                '&:hover .edit-icon, &:focus-within .edit-icon': {
                  visibility: 'visible',
                },
              }}
            >
              <Typography width="90%">{option}</Typography>
              {handleEditOption && (
                <IconButton
                  className="edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditOption(option);
                  }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <Iconify icon="mingcute:edit-line" />
                </IconButton>
              )}
            </Box>
          );
        }}
        renderInput={(params) => (
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField {...params} variant="standard" label={label} />
            <IconButton
              onClick={handleAddEvent}
              sx={{ml: 1}}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Box>
        )}
      />
    </Box>
  );
}
