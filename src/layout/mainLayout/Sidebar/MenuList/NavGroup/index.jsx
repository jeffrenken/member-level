import logoDark from '@/assets/images/logoDark.png';
import logoWhite from '@/assets/images/logoWhite.png';
import { ThemeContext } from '@/context/ThemeContextProvider';
import { favoritesState } from '@/state/favoritesAtom';
import { Box, Fade, IconButton, List, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconMoon, IconSun, IconUserCircle } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import NavCollapse from '../NavCollapse';
import { NavItemStacked as NavItem } from '../NavItem/NavItemStacked';

const NavGroup = ({ item, drawerToggle }) => {
  const theme = useTheme();
  const { switchColorMode } = useContext(ThemeContext);

  const isDarkMode = theme.palette.mode === 'dark';

  const favorites = useRecoilValue(favoritesState);
  const location = useLocation();

  // menu list collapse & items
  const items = item.children?.map((menu, i) => {
    const fadeInTime = 700 * (i + 1);
    switch (menu.type) {
      case 'collapse':
        return (
          <Fade in={true} appear timeout={fadeInTime} key={menu.id}>
            <div>
              <NavCollapse key={menu.id} menu={menu} level={1} />
            </div>
          </Fade>
        );
      case 'item':
        return (
          <Fade in={true} appear timeout={fadeInTime} key={menu.id}>
            <Box sx={{ borderRight: location.pathname === menu.url ? `2px solid ${theme.palette.primary.main}` : 'none' }}>
              <NavItem key={menu.id} item={menu} level={1} drawerToggle={drawerToggle} />
            </Box>
          </Fade>
        );
      case 'component':
        return (
          <Fade in={true} appear timeout={fadeInTime} key={menu.id}>
            <Box mx={2} my={2}>
              <menu.component />
            </Box>
          </Fade>
        );
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <Box>
        <Box
          component="img"
          alt="logo"
          src={isDarkMode ? logoWhite : logoDark}
          height={30}
          mt={2}
          mb={2}
          sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 1, objectFit: 'contain' }}
        />
        <Stack direction="row" justifyContent="center" sx={{ width: '100%', mb: 'calc((100vh - 650px) / 2)' }}>
          <IconButton color="neutral" onClick={switchColorMode}>
            {isDarkMode ? <IconSun /> : <IconMoon />}
          </IconButton>
          <IconButton color="neutral">
            <IconUserCircle style={{ strokeWidth: 1.5 }} />
          </IconButton>
        </Stack>
        <List
          subheader={
            item.title && (
              <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                {item.title}
                {item.caption && (
                  <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                    {item.caption}
                  </Typography>
                )}
              </Typography>
            )
          }
        >
          {items}
          {/* <Fade in={true} appear timeout={500}>
          <div>
            <NavCollapse
              level={1}
              menu={{
                title: 'Favorites',
                icon: IconStar,
                children: favorites.map((favorite) => ({ id: favorite.name, title: favorite.name, type: 'item', url: favorite.path }))
              }}
            />
          </div>
        </Fade> */}
        </List>
      </Box>
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;

/*  sx={(theme) => ({
          backgroundColor: theme.palette.background.semiTransparent,
          paddingTop: '20px',
          marginRight: '20px',
          boxShadow: '0 2px 14px 0 rgb(32 40 45 / 30%)',
          border: '1px solid #2d3748',
          borderLeft: 'none',
          borderRadius: '0 10px 10px 0'
        })} */
