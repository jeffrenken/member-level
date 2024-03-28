import { Typography } from '@mui/material';
import { items } from '../sidebar-items';
import NavGroup from './NavGroup';

const MenuList = ({ drawerToggle }) => {
  const navItems = items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} drawerToggle={drawerToggle} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
