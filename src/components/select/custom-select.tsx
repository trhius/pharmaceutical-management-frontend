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
  multiple?: boolean;
  holder?: string;
  options: any;
  selected: any | undefined;
  setSelected: (value: any) => void;
  handleAddEvent?: () => void;
  handleEditOption?: (option: string) => void;
  inputStyle?: boolean;
  error?: string;
  setError?: (error: string) => void;
};

export function Select({
  title,
  multiple,
  holder,
  options,
  selected,
  setSelected,
  handleAddEvent,
  handleEditOption,
  inputStyle,
  error,
  setError,
}: SelectProps) {
  const [open, setOpen] = useState(true);

  const selectedValue = selected || (multiple ? [] : null);

  if (inputStyle) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Autocomplete
          fullWidth
          multiple={multiple}
          options={options}
          value={selectedValue}
          getOptionLabel={(option) => option.label ?? ''}
          onChange={(event, newValue) => {
            setSelected(newValue);
            if (setError) setError('');
          }}
          slotProps={{
            paper: {
              sx: {
                boxShadow:
                  '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12), 0 0 0 2px rgba(145, 158, 171, 0.08), 0 8px 16px -4px rgba(145, 158, 171, 0.16)',
                borderRadius: '8px',
                border: '1px solid rgba(145, 158, 171, 0.12)',
              },
            },
          }}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <Box
                component="li"
                key={key}
                {...otherProps}
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
                <Typography width="90%">{option.label}</Typography>
                {handleEditOption && (
                  <IconButton
                    className="edit-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditOption(option);
                    }}
                    sx={{
                      visibility: 'hidden',
                      padding: '4px',
                      '& .MuiSvgIcon-root': {
                        fontSize: '1rem',
                      },
                    }}
                    size="small"
                  >
                    <Iconify icon="mingcute:edit-line" />
                  </IconButton>
                )}
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label={holder} error={!!error} helperText={error} />
          )}
        />
        <Box sx={{ ml: 1 }}>
          {handleAddEvent && (
            <IconButton onClick={handleAddEvent}>
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  }
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
          {handleAddEvent && (
            <IconButton onClick={handleAddEvent}>
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          )}
          <IconButton onClick={() => setOpen(!open)}>
            <Iconify icon={open ? 'mingcute:up-line' : 'mingcute:down-line'} />
          </IconButton>
        </Box>
      </Box>

      {open && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            multiple={multiple}
            options={options}
            value={selectedValue}
            getOptionLabel={(option) => option.label ?? ''}
            onChange={(event, newValue) => setSelected(newValue)}
            slotProps={{
              paper: {
                sx: {
                  boxShadow:
                    '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12), 0 0 0 2px rgba(145, 158, 171, 0.08), 0 8px 16px -4px rgba(145, 158, 171, 0.16)',
                  borderRadius: '8px',
                  border: '1px solid rgba(145, 158, 171, 0.12)',
                },
              },
            }}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box
                  component="li"
                  key={key}
                  {...otherProps}
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
                  <Typography width="90%">{option.label}</Typography>
                  {handleEditOption && (
                    <IconButton
                      className="edit-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOption(option);
                      }}
                      sx={{
                        visibility: 'hidden',
                        padding: '4px',
                        '& .MuiSvgIcon-root': {
                          fontSize: '1rem',
                        },
                      }}
                      size="small"
                    >
                      <Iconify icon="mingcute:edit-line" />
                    </IconButton>
                  )}
                </Box>
              );
            }}
            renderInput={(params) => <TextField {...params} label={holder} />}
          />
        </Box>
      )}
    </Card>
  );
}
