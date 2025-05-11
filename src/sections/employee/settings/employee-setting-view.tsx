import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

import { DashboardContent } from 'src/layouts/dashboard';

import MenuList from 'src/components/menu/menu-list';

// ------------------------------------------------------------------------------
const mainListItems = [
  { text: 'Init', icon: <HomeRoundedIcon />, link: '/employee-setting' },
  { text: 'Work shift', icon: <AnalyticsRoundedIcon />, link: '/work-shift' },
  { text: 'Timesheet', icon: <PeopleRoundedIcon />, link: '/timesheet' },
  { text: 'Payroll', icon: <PeopleRoundedIcon />, link: '/payroll' },
  { text: 'Working days & holidays', icon: <AssignmentRoundedIcon />, link: '/working-day' },
];

type EmployeeSettingProps = { header?: React.ReactNode; children: React.ReactNode };

export function EmployeeSettingView({ header, children }: EmployeeSettingProps) {
  return (
    <DashboardContent sx={{ backgroundColor: '#f5f5f5' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Employee Setting
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 10 }}>{header && <Box>{header}</Box>}</Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MenuList listItems={mainListItems} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 10 }}>
          <Card>{children}</Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
