import { Box, ButtonBase, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
export default function MeasureCard({ measure }) {
  const [isActive, setIsActive] = useState(false);

  const shadow = !isActive
    ? '5px 5px 9px rgba(94,104,121,0.3), -5px -5px 9px rgba(255,255,255,0.45)'
    : 'inset 5px 5px 9px rgba(94,104,121,0.3)';

  return (
    <Box
      sx={{
        //border: '1px solid #e2e8f0',
        borderRadius: '10px',
        textDecoration: 'none',
        //background: '#dde1e7',
        boxShadow: shadow
      }}
      width={170}
      height={170}
      p={2}
      component={Link}
      to={`/measures/${measure.id}`}
      color={'inherit'}
      onClick={() => setIsActive(!isActive)}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" height="100%">
        {measure.label}
      </Stack>
    </Box>
  );
}
