import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { DTable } from 'src/components/table/table';

import { EmployeeSettingView } from '../../settings';
import { WorkshiftCreationForm } from '../workshift-creation-form';
// --------------------------------------------------------

export function EmployeeWorkshiftView() {
  const [formOpen, setFormOpen] = useState(false);

  const header = (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        Danh sách ca làm việc
      </Typography>
      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => setFormOpen(true)}
      >
        Thêm ca làm việc
      </Button>
    </Box>
  );
  return (
    <EmployeeSettingView header={header}>
      <DTable
        data={[]}
        headerConfigs={[
          { id: 'id', label: 'STT' },
          { id: 'name', label: 'Ca làm việc' },
          { id: 'phone', label: 'Thời gian' },
          { id: 'nationalId', label: 'Tổng giờ làm việc' },
          { id: 'debtsAndAdvances', label: 'Chi nhánh' },
          { id: 'note', label: 'Hoạt động' },
          { id: '' },
        ]}
        rowConfigs={[
          {
            field: 'id',
          },
          {
            field: 'name',
          },
          { field: 'phone' },
          { field: 'nationalId' },
          {
            field: 'debtsAndAdvances',
            align: 'right',
          },
          {
            field: 'note',
          },
        ]}
      />
      <WorkshiftCreationForm popupOpen={formOpen} setPopupOpen={setFormOpen} />
    </EmployeeSettingView>
  );
}
