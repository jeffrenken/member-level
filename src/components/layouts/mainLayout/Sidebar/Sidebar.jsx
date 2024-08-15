import { useTheme } from '@/hooks';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { BrowserView, MobileView } from 'react-device-detect';
import SidebarItems from './SidebarItems';

const Sidebar = ({ drawerOpen, drawerToggle, drawerWidth, window }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const drawer = (
    <>
      <BrowserView>
        <SidebarItems drawerToggle={drawerToggle} />
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}></Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }}>
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            //marginTop: '120px',
            //flex: 1,
            //justifyContent: 'center',
            //alignItems: 'center',
            //background: isDarkMode ? theme.palette.background.paper : '#f8f8f8',
            background: isDarkMode ? theme.palette.background.paper : theme.palette.background.paper,
            //background: 'transparent',
            color: theme.palette.text.primary,
            borderRight: 'none', //theme.palette.border,
            //marginRight: '30px',
            [theme.breakpoints.up('md')]: {
              //top: '88px'
              //top: '72px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
