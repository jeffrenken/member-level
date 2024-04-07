import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, ButtonBase, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const NavItemStacked = ({ item, level, drawerToggle }) => {
  const theme = useTheme();
  //const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customization = {}; //useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down('md'));

  const Icon = item.icon;
  const itemIcon = item?.icon ? <Icon stroke={1.5} size="1.3rem" /> : null;

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

  // active menu item on page load
  useEffect(() => {
    /* const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id });
    } */
    // eslint-disable-next-line
  }, [pathname]);

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
        <Typography variant={'body1'} color="inherit" align="center">
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
