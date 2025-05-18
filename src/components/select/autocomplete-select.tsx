import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';

import { Iconify } from '../iconify';
//--------------------------------------

type SelectProps = {
  title: string;
  holder?: string;
  options: string[];
  selected: string[];
  setSelected: (value: string[]) => void;
  handleAddEvent: () => void;
  handleEditOption?: (option: string) => void;
};

export function Select({
  title,
  holder,
  options,
  selected,
  setSelected,
  handleAddEvent,
  handleEditOption,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Box>
          <IconButton onClick={handleAddEvent}>
            <Iconify icon="mingcute:add-line" />
          </IconButton>
          <IconButton onClick={() => setOpen(!open)}>
            <Iconify icon={open ? 'mingcute:up-line' : 'mingcute:down-line'} />
          </IconButton>
        </Box>
      </Box>

      {open && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            multiple
            options={options}
            value={selected}
            onChange={(event, newValue) => setSelected(newValue)}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  '&:hover .edit-icon, &:focus-within .edit-icon': {
                    visibility: 'visible', // Show the icon on hover or focus
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
                      visibility: 'hidden', // Hide the icon by default
                    }}
                  >
                    <Iconify icon="mingcute:edit-line" />
                  </IconButton>
                )}
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} multiline variant="standard" label={holder} />
            )}
          />
        </Box>
      )}
    </Card>
  );
}
