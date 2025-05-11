import type { LinearProgressProps } from '@mui/material/LinearProgress';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import LinearProgress from '@mui/material/LinearProgress';

import { ROUTES } from 'src/routes/config';

import { EmployeeSettingView } from '../settings';
import { EmployeeCreationForm } from '../employee-creation-form';

// ----------------------------------------------------------------------
export function EmployeeInitView() {
  const [employeePopupOpen, setEmployeePopupOpen] = useState(false);

  return (
    <>
      <EmployeeSettingView>
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 1 }}>
          <ListItem alignItems="center">
            <ListItemAvatar>
              <StarIcon />
            </ListItemAvatar>
            <ListItemText
              primary="Init"
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.primary', display: 'inline' }}
                >
                  Just a few installation steps to effectively manage employees, optimize operations
                  and calculate salaries accurately
                </Typography>
              }
            />
            <Box sx={{ width: '130px' }}>
              <LinearProgressWithLabel value={10} />
            </Box>
          </ListItem>
          <Divider variant="fullWidth" component="li" />
          <ListItem alignItems="center">
            <ListItemAvatar>
              <CheckIcon />
            </ListItemAvatar>
            <ListItemText
              primary="Add new employee"
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline', mr: 1 }}
                  >
                    The booth is occupied by one employee.
                  </Typography>
                  <Link to={ROUTES.EMPLOYEE}>View employees</Link>
                </>
              }
            />
            <Button variant="outlined" onClick={() => setEmployeePopupOpen(true)}>
              Add employee
            </Button>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="center">
            <ListItemAvatar>
              <CheckIcon />
            </ListItemAvatar>
            <ListItemText
              primary="Xếp lịch làm việc"
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.primary', display: 'inline' }}
                >
                  Tạo ca và xếp lịch cho nhân viên.
                </Typography>
              }
            />
            <Button variant="outlined">
              Tạo lịch
            </Button>
          </ListItem>
          <Divider variant="fullWidth" component="li" />
          <ListItem alignItems="center">
            <ListItemAvatar>
              <CheckIcon />
            </ListItemAvatar>
            <ListItemText
              primary="Thiết lập chấm công"
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.primary', display: 'inline' }}
                >
                  Cài đặt và chọn hình thức chấm công cho cửa hàng
                </Typography>
              }
            />
            <Button variant="outlined">
              Thiết lập
            </Button>
          </ListItem>
          <Divider variant="fullWidth" component="li" />
          <ListItem alignItems="center">
            <ListItemAvatar>
              <CheckIcon />
            </ListItemAvatar>
            <ListItemText
              primary="Thiết lập bảng lương"
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.primary', display: 'inline' }}
                >
                  Theo dõi chính xác và tự động tính toán lương của từng nhân viên.
                </Typography>
              }
            />
            <Button variant="outlined">
              Thiết lập
            </Button>
          </ListItem>
          <Divider variant="fullWidth" component="li" />
        </List>
      </EmployeeSettingView>
      <EmployeeCreationForm popupOpen={employeePopupOpen} setPopupOpen={setEmployeePopupOpen} />
    </>
  );
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`You completed ${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
