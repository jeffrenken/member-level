import {
  Avatar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import { IconInbox, IconUserHeart } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMembers } from '@/api';
import { Stack } from '@/components/ui';

function findObjectsWithMentionAndName(data, name) {
  const result = [];

  function containsMention(content) {
    // Base case: Check if the current node is a mention and matches the name
    if (content.type === 'mention' && content.attrs?.id === name) {
      return true;
    }

    // Recursive case: Check nested content if it exists
    if (content.content && Array.isArray(content.content)) {
      return content.content.some((child) => containsMention(child));
    }

    // If no mentions are found at this level or deeper
    return false;
  }

  data.forEach((item) => {
    if (containsMention(item.content)) {
      result.push(item);
    }
  });

  return result;
}

const notifications = [
  { id: 2, name: 'Dwight', action: 'mentioned', target: 'You', time: '36 mins ago', type: 'members', typeId: 954 },
  { id: 3, name: 'Jim', action: 'mentioned', target: 'You', time: '3 hours ago', type: 'members', typeId: 954 }
];

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: '0px'
}));

const SidebarIcon = ({ IconComponent }) => {
  return <IconComponent style={{ strokeWidth: 1 }} />;
};

const avatarHexColors = ['#009688', '#00BCD4', '#2196F3', '#3F51B5', '#673AB7', '#9C27B0', '#795548', '#FF9800', '#607D8B'];

export default function NotificationList({ button }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  console.log('tabValue', tabValue);
  const { data: members } = useMembers();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <StyledIconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 15, minWidth: 15 } }}>
          <SidebarIcon IconComponent={IconInbox} />
        </Badge>
      </StyledIconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: '320px',
              maxHeight: '500px',
              //mt: '45px',
              borderRadius: '10px',
              boxShadow: theme.palette.shadowBlue
            }
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={2}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: '0.7rem' }}>
            Mark all as read
          </Typography>
        </Stack>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider'
            //style tab Button
          }}
        >
          <Tab label={`Inbox (${notifications.length})`} />
          <Tab label={`General (1)`} />
        </Tabs>
        {tabValue === 0 && (
          <List sx={{ width: '100%', marginY: 0 }}>
            {notifications.map((notification, i) => {
              const member = members.find((member) => member.id === notification.typeId);
              return (
                <MenuItem
                  key={notification.id}
                  onClick={handleClose}
                  disableGutters
                  component={Link}
                  to={`/${notification.type}/${notification.typeId}?notification=${notification.id}`}
                >
                  <ListItem dense alignItems="flex-start" secondaryAction={<Badge variant="dot" color="success" />}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: avatarHexColors[i], color: 'white' }}>{notification.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography component="span" variant="body2" fontWeight="bold">
                            {notification.name}
                          </Typography>{' '}
                          <Typography component="span" variant="body2">
                            {notification.action}{' '}
                          </Typography>
                          <Typography component="span" variant="body2" fontWeight="bold">
                            {notification.target}
                          </Typography>{' '}
                          <Typography component="span" variant="body2">
                            about:
                          </Typography>
                        </>
                      }
                      secondary={
                        <Box>
                          <Typography>
                            Member - {member?.firstName} {member?.lastName}
                          </Typography>
                          <Typography component="span" variant="caption">
                            {notification.time}
                          </Typography>
                          {/* {notification.isFile && (
                        <div style={{ marginTop: '5px' }}>
                          <Button variant="outlined" size="small" color="primary" sx={{ textTransform: 'none' }}>
                            Accept
                          </Button>
                          <Button size="small" sx={{ textTransform: 'none', ml: 1 }}>
                            Decline
                          </Button>
                        </div>
                      )} */}
                        </Box>
                      }
                    />
                  </ListItem>
                </MenuItem>
              );
            })}
          </List>
        )}
        {tabValue === 1 && (
          <List sx={{ width: '100%' }}>
            <MenuItem onClick={handleClose} disableGutters component={Link} to={`/hei`}>
              <ListItem dense alignItems="flex-start" secondaryAction={<Badge variant="dot" color="success" />}>
                <ListItemIcon>
                  <IconUserHeart />
                </ListItemIcon>
                <ListItemText
                  sx={{ paddingTop: '8px' }}
                  primary={
                    <>
                      <Typography component="span" variant="body2" fontWeight="bold">
                        HEI: BCS-E dropped a threshold
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </MenuItem>
          </List>
        )}
      </Menu>
    </>
  );
}
