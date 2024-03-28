import ContractsAutocomplete from '@/components/inputs/ContractsAutocomplete';
import StatesAutocomplete from '@/components/inputs/StatesAutocomplete';
import { AppBar, Box, CssBaseline, IconButton, Paper, Stack, Toolbar, Tooltip, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './header/Header';
import { IconPlus } from '@tabler/icons-react';
import SaveToFavoritesDialog from '@/components/dialogs/SaveToFavoritesDialog';

const drawerWidth = 200;

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

  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const [leftDrawerOpened, setLeftDrawerOpened] = useState(true);
  const handleLeftDrawerToggle = () => {
    setLeftDrawerOpened(!leftDrawerOpened);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          //bgcolor: theme.palette.background.default,
          background: theme.palette.background.semiTransparent,

          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      <Sidebar
        drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
        drawerWidth={drawerWidth}
        drawerToggle={handleLeftDrawerToggle}
      />

      <Main theme={theme} open={leftDrawerOpened} sx={{ bgcolor: 'transparent', overflow: 'auto' }}>
        <Box sx={{ display: 'block', width: '100%' }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;
