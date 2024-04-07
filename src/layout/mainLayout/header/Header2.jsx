import PropTypes from 'prop-types';
import { Box, IconButton, Stack, Link as MuiLink, AppBar, Toolbar, Popover, Button, List, ListItem, ListItemButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from '@/context/ThemeContextProvider';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { IconChevronDown, IconMenu2, IconMoon, IconSun } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoWhite from '@/assets/images/logoWhite.png';
import logoDark from '@/assets/images/logoDark.png';
import MeasureAutocomplete from '@/components/inputs/MeasureAutocomplete';
import useMeasures from '@/api/useMeasures';
import React from 'react';

const contracts = [
  { h_code: 'H1111', label: 'Health Plan 1' },
  { h_code: 'H2222', label: 'Health Plan 2' },
  { h_code: 'H3333', label: 'Health Plan 3' },
  { h_code: 'H4444', label: 'Health Plan 4' },
  { h_code: 'H5555', label: 'Health Plan 5' },
  { h_code: 'H6666', label: 'Health Plan 6' }
];

const Header = ({ handleLeftDrawerToggle, leftDrawerOpened }) => {
  const theme = useTheme();
  const { data: measures } = useMeasures();
  const { switchColorMode } = useContext(ThemeContext);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <>
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          background: 'transparent',
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={(theme) => ({
                backgroundColor: theme.palette.background.semiTransparent,
                padding: '8px 16px',
                borderRadius: '10px',
                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
              })}
            >
              <Box
                component="img"
                alt="logo"
                src={isDarkMode ? logoWhite : logoDark}
                height={30}
                sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 1, objectFit: 'contain' }}
              />

              <Button endIcon={<IconChevronDown size={18} />} size="large" onClick={handleClick}>
                {selected?.label ? `${selected?.label} - ${selected?.h_code}` : 'Select Contract'}
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                <List>
                  {contracts.map((items) => (
                    <ListItemButton
                      key={items.h_code}
                      onClick={() => {
                        handleClose();
                        setSelected(items);
                      }}
                    >
                      {items.h_code}
                    </ListItemButton>
                  ))}
                </List>
              </Popover>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={switchColorMode}>{isDarkMode ? <IconSun /> : <IconMoon />}</IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;

{
  /* <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          ></Avatar> */
}
