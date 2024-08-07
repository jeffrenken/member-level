import { favoritesState } from '@/state/favoritesAtom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField,
  DialogActions,
  Button,
  FormControl,
  Typography
} from '@mui/material';
import { IconPlus, IconStar } from '@tabler/icons-react';
import { enqueueSnackbar } from 'notistack';
import * as React from 'react';
import { useRecoilState } from 'recoil';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface Favorite {
  name: string;
  path: string;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState(false);
  const [favorites, setFavorites] = useRecoilState(favoritesState);

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleSave = () => {
    //maybe side effect in recoil
    if (name === '') {
      setError(true);
      return;
    }
    const pathString = window.location.pathname + window.location.search;
    setFavorites((oldFavorites: Favorite[]) => [...oldFavorites, { name: name, path: pathString }]);
    onClose();
    setName('');
    enqueueSnackbar('Saved to favorites', { variant: 'success' });
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth>
      <DialogContent>
        {!location.search ? (
          <div>
            <Typography align="center">Select filters before saving.</Typography>
          </div>
        ) : (
          <>
            <Typography>Save selected filters</Typography>
            <FormControl fullWidth>
              <TextField
                autoFocus
                label="Name"
                margin="dense"
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }}
                error={error}
                helperText={error ? 'Please enter a name.' : ''}
              />
              {/* dense prevents label cutoff */}
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!location.search}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SaveToFavoritesDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Save to favorites">
        <IconButton onClick={handleClickOpen}>
          <IconStar />
        </IconButton>
      </Tooltip>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
}
