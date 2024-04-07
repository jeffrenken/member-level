import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { BrowserView, MobileView } from 'react-device-detect';
import MenuList from './MenuList';
import logoWhite from '@/assets/images/logoWhite.png';
import logoDark from '@/assets/images/logoDark.png';
const Sidebar = ({ drawerOpen, drawerToggle, drawerWidth, window }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const drawer = (
    <>
      <BrowserView>
        <MenuList drawerToggle={drawerToggle} />
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList drawerToggle={drawerToggle} />
        </Box>
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
            background: theme.palette.background.semiTransparent,
            //background: 'transparent',
            color: theme.palette.text.primary,
            borderRight: 'none',
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
