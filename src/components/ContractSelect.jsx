import { Button, List, ListItemButton, Popover } from '@mui/material';
import React from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import { contractState } from '@/state/contract';

const contracts = [
  { h_code: 'H1111', label: 'Health Plan 1' },
  { h_code: 'H2222', label: 'Health Plan 2' },
  { h_code: 'H3333', label: 'Health Plan 3' },
  { h_code: 'H4444', label: 'Health Plan 4' },
  { h_code: 'H5555', label: 'Health Plan 5' },
  { h_code: 'H6666', label: 'Health Plan 6' }
];

export default function ContractSelect() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = useRecoilState(contractState);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button endIcon={<IconChevronDown size={18} />} size="large" onClick={handleClick}>
        {selected?.label ? `${selected?.label} - ${selected?.h_code}` : 'Select Contract'}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <List>
          {contracts.map((items) => (
            <ListItemButton
              key={items.h_code}
              onClick={() => {
                handleClose();
                setSelected(items);
              }}
            >
              {items.h_code}
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}
