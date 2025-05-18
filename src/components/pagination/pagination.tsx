import type { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// -------------------------------------------------

type PaginationProps = {
  rowsPerPage: number;
  onChangeRowsPerPage: (event: SelectChangeEvent) => void;
  rowsPerPageOptions: number[];
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

export function DPagination({
  rowsPerPage,
  onChangeRowsPerPage,
  rowsPerPageOptions,
  page,
  count,
  onPageChange,
}: PaginationProps) {
  return (
    <Box>
      <Divider />

      <Box
        sx={{ my: 1, mr: 2, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}
      >
        <Typography variant="body2">Rows per page:</Typography>
        <FormControl size="small">
          <Select
            value={'' + rowsPerPage}
            onChange={onChangeRowsPerPage}
            sx={{
              minWidth: 75,
              '& .MuiSelect-select': {
                py: 1,
              },
            }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {count !== 1 && <Stack spacing={2}>
          <Pagination
            page={page}
            count={count}
            onChange={onPageChange}
            renderItem={(item: any) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Stack>}
      </Box>
    </Box>
  );
}
