import { Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material';

export function Menu(props) {
  return <MuiMenu {...props} />;
}
export function MenuItem(props) {
  return <MuiMenuItem {...props} />;
}
