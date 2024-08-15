import { Dialog as MuiDialog, DialogActions as MuiDialogActions, DialogContent as MuiDialogContent } from '@mui/material';
//might need content, actions, etc

export function Dialog(props) {
  return <MuiDialog {...props} />;
}

export function DialogActions(props) {
  return <MuiDialogActions {...props} />;
}

export function DialogContent(props) {
  return <MuiDialogContent {...props} />;
}
