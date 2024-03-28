import PropTypes from 'prop-types';
import { Box, Fade, List, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NavCollapse from '../NavCollapse';
import NavItem from '../NavItem';
import Grow from '@mui/material/Grow';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useRecoilValue } from 'recoil';
import { favoritesState } from '@/state/favoritesAtom';
import { IconStar } from '@tabler/icons-react';

const NavGroup = ({ item, drawerToggle }) => {
  const theme = useTheme();
  const favorites = useRecoilValue(favoritesState);

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
            <div>
              <NavItem key={menu.id} item={menu} level={1} drawerToggle={drawerToggle} />
            </div>
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
        <Fade in={true} appear timeout={500}>
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
        </Fade>
      </List>
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
