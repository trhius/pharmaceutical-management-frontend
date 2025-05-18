import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { useFilter } from 'src/hooks/useFilter';
import { useDebounce } from 'src/hooks/use-debounce';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

type CustomTableToolbarProps = {
  numSelected: number;
  customSearchKeyword?: string;
  customSearchOptions?: Record<string, string>[];
};

export function CustomTableToolbar({
  numSelected,
  customSearchKeyword,
  customSearchOptions,
}: CustomTableToolbarProps) {
  const { updateFilters } = useFilter();

  const [searchValue, setSearchValue] = useState('');

  const [searchOption, setSearchOption] = useState<Record<string, string> | undefined>(() =>
    customSearchOptions && customSearchOptions?.length > 0 ? customSearchOptions?.at(0) : undefined
  );

  const [debouncedValue, setDebouncedValue] = useState('');

  const debouncedSearchInput = useDebounce(debouncedValue, 500);

  useEffect(() => {
    const filter: Record<string, string> = { search: debouncedSearchInput };
    if (searchOption && searchOption.key && customSearchKeyword !== undefined) {
      filter[customSearchKeyword] = searchOption.key;
    }
    if (filter.search) {
      updateFilters(filter);
    }
  }, [debouncedSearchInput, searchOption, updateFilters, customSearchKeyword]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(event.target.value as string);
    setSearchValue(event.target.value as string);
  };

  const handleChangeSearchOption = (event: SelectChangeEvent) => {
    const selectedOption = customSearchOptions
      ?.filter((option: Record<string, string>) => option.key === (event.target.value as string))
      .at(0);

    setSearchOption(selectedOption);
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" gap={1}>
          {customSearchOptions && customSearchOptions?.length > 0 && (
            <FormControl size="small">
              <Select
                value={searchOption?.key}
                onChange={handleChangeSearchOption}
                sx={{
                  width: 'max-content',
                  maxWidth: 200,
                  minWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '& .MuiSelect-select': {
                    py: 1,
                  },
                }}
              >
                {customSearchOptions.map((option: Record<string, string>) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Box>
            <OutlinedInput
              fullWidth
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search ..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ maxWidth: 320 }}
            />
          </Box>
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
