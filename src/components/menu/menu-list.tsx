import * as React from 'react';

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { useRouter, usePathname } from 'src/routes/hooks';
// import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
// import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
// import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

// const secondaryListItems = [
//   { text: 'Settings', icon: <SettingsRoundedIcon /> },
//   { text: 'About', icon: <InfoRoundedIcon /> },
//   { text: 'Feedback', icon: <HelpRoundedIcon /> },
// ];

// -----------------------------------------------------------------------------------

type ListItem = {
  text: string;
  icon: React.ReactNode;
  link: string;
};

type ListItemProps = {
  listItems: ListItem[];
};

export default function MenuList({ listItems }: ListItemProps) {
  const router = useRouter();

  const path = usePathname();

  return (
    <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <List dense sx={{ p: 0, m: 0 }}>
        {listItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={item.link === path} onClick={() => router.push(item.link)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
