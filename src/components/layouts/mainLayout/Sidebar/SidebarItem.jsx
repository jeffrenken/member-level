import { Avatar, Box, Chip, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SidebarItem = ({ item, level, drawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const isDarkMode = theme.palette.mode === 'dark';
  //const dispatch = useDispatch();
  const customization = {}; //useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down('md'));
  const mainColor = isDarkMode
    ? theme.palette.text.primary
    : location.pathname === item.url
    ? theme.palette.text.primary
    : theme.palette.text.primary;

  const Icon = item.icon;
  const itemIcon = item?.icon ? <Icon stroke={1.5} size="1.3rem" color={mainColor} /> : null;

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = () => {
    if (matchesSM) {
      drawerToggle();
    }
  };

  return (
    <Stack
      {...listItemProps}
      direction="column"
      spacing={0}
      justifyContent="center"
      alignItems="center"
      disabled={item.disabled}
      mb={4}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        color: theme.palette.text.primary,
        textDecoration: 'none',
        //mb: 0.5,
        //alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit'
        //py: level > 1 ? 1 : 1.25,
        //pl: `${level * 24}px`
      }}
      //selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      onClick={itemHandler}
    >
      <Box>{itemIcon}</Box>
      <Box>
        <Typography align="center" sx={{ fontSize: '0.8rem', color: mainColor }}>
          {item.title}
        </Typography>
      </Box>
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </Stack>
  );
};
