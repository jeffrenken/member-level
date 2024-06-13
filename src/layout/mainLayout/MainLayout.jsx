import { Box, CssBaseline, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';

const drawerWidth = 110;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 0),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '0px',
    width: `calc(100% - ${drawerWidth}px)`
    //padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '0px',
    width: `calc(100% - ${drawerWidth}px)`,
    //padding: '16px',
    marginRight: '0px'
  }
}));

const MainLayout = () => {
  const theme = useTheme();
  const location = useLocation();

  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const [leftDrawerOpened, setLeftDrawerOpened] = useState(true);
  const handleLeftDrawerToggle = () => {
    setLeftDrawerOpened(!leftDrawerOpened);
  };

  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/*       <Header handleLeftDrawerToggle={handleLeftDrawerToggle} leftDrawerOpened={leftDrawerOpened} />
       */}
      <Sidebar
        drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
        drawerWidth={drawerWidth}
        drawerToggle={handleLeftDrawerToggle}
      />

      <Main theme={theme} open={leftDrawerOpened} sx={{ bgcolor: 'transparent' }}>
        <Box sx={{ display: 'block', width: '100%' }}>
          <Outlet />
          {location.pathname !== '/map' && (
            <Typography align="center" my={1} sx={{ backgroundColor: 'transparent', fontSize: '0.8rem' }}>
              © {currentYear} EQO Health. All rights reserved.
            </Typography>
          )}
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;
