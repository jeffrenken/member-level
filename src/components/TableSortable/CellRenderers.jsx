import { Typography, Rating } from '@mui/material';
import { Box, Menu, MenuItem, Button, Stack, IconButton } from '@/components';
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

export const MeasureRenderer = ({ value, params }) => {
  return (
    <Box>
      <Typography sx={{ fontWeight: 200 }}>{params.data.hl_code}</Typography>
      <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
};

function getRandomValueBetween(min, max) {
  return Math.random() * (max - min) + min;
}
export const RatingRenderer = ({ value }) => {
  return <Rating value={getRandomValueBetween(0, 5)} precision={0.5} size='small' readOnly />;
};

export const PlusMinusNumberRenderer = ({ value }) => {
  let sign = '';
  let valueCopy = value;
  if (value > 0) {
    sign = <span style={{ color: 'green' }}>+</span>;
  }
  if (value < 0) {
    const val = (value *= -1);
    sign = <span style={{ color: 'red' }}>-</span>;
    valueCopy = val;
  }
  return (
    <Typography align='center'>
      {sign}
      {valueCopy}
    </Typography>
  );
};

export const ColumnSelectRenderer = (column, index, handleSort, handleColumnsChange) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  //const [label, setLabel] = useState(options[0].label);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    //setSelectedIndex(index);
    //setLabel(option.label);
    handleClose();
    handleColumnsChange(index, option);
  };

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='center'
      spacing={1}
      sx={{ minWidth: '110px', maxWidth: '110px' }}
    >
      <div onClick={handleSort}>{column?.label && column?.label.toUpperCase()}</div>
      <IconButton onClick={handleClick}>
        <IconChevronDown size={16} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {column.columns.map((option, index) => (
          <MenuItem
            key={option.name}
            onClick={() => handleMenuItemClick(option)}
            value={option.label}
            selected={selectedIndex === index}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};
