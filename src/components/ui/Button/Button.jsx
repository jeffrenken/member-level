import { Button as MuiButton, ButtonBase as MuiButtonBase } from '@mui/material';

export function Button(props) {
  return <MuiButton {...props} />;
}

export function ButtonBase(props) {
  return <MuiButtonBase {...props} />;
}
