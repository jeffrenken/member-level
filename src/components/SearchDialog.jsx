import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  Divider,
  ButtonBase,
  useTheme,
  InputAdornment
} from '@mui/material';
import useMembers from '@/api/useMembers';
import useProviderGroups from '@/api/useProvidersGroups';
import { IconSearch, IconUser } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import useProviders from '@/api/useProviders';

//create a dialog with an input from Mui components
export function SearchDialog({ open, onClose }) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredItems, setFilteredItems] = React.useState([]);
  const { data: members } = useMembers();
  const { data: providerGroups } = useProviderGroups();
  const { data: providers } = useProviders();

  const searchItems = React.useMemo(() => {
    const items = [];

    providers.length &&
      providers.forEach((provider) => {
        items.push({
          id: provider.id,
          category: 'Provider',
          value: provider.value.replace(/\s/g, ''),
          url: `/providers/${provider.value}`,
          label: provider.value
        });
      });
    members.length &&
      members.forEach((member) => {
        items.push({
          id: member['MEMBER ID'],
          category: 'Member',
          value: member['FIRST NAME'] + member['LAST NAME'],
          url: `/members/${member['MEMBER ID']}`,
          label: member['FIRST NAME'] + ' ' + member['LAST NAME']
        });
      });

    return items;
  }, [members, providers]);

  React.useEffect(() => {
    if (searchTerm === '') {
      //reset list
      setFilteredItems(searchItems);
      return;
    }
    //remove spaces
    const search = searchTerm.replace(/\s/g, '');
    const results = searchItems.filter((item) => {
      return item.value.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredItems(results);
  }, [searchTerm, searchItems]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="xs"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          minHeight: '40%',
          maxHeight: '40%',
          backgroundColor: theme.palette.background.semiTransparent2,
          paddingBottom: '1rem'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: `${theme.palette.border}` }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          //label="Name"
          type="text"
          fullWidth
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            )
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </DialogTitle>
      <DialogContent>
        <List sx={{ width: '100%' }}>
          {filteredItems.slice(0, 10).map((item) => (
            <React.Fragment key={item.id}>
              <ButtonBase component={Link} to={item.url} sx={{ width: '100%' }}>
                <ListItem
                  //disableGutters
                  //px={0}
                  sx={{
                    paddingTop: '0px',
                    paddingBottom: '0px',
                    marginBottom: '13px',
                    border: `${theme.palette.border}`,
                    borderRadius: '10px',
                    bgcolor: theme.palette.background.paper
                  }}
                >
                  <ListItemText
                    primary={<Typography sx={{ fontSize: '1rem' }}>{item.label}</Typography>}
                    secondary={
                      <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                        {item.category}
                      </Typography>
                    }
                  />
                </ListItem>
              </ButtonBase>
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
