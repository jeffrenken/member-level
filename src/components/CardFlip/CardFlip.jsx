import { Box } from '@/components';
import { useTheme } from '@/hooks';

import { useState } from 'react';
import './card-flip.css';

export default function CardFlip({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = useTheme();

  return (
    <Box className='card-flip-page-container'>
      <Box
        sx={{ cursor: 'pointer' }}
        className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <Box className='card-flip-front'>{front}</Box>
        <Box className='card-flip-back'>{back}</Box>
      </Box>
    </Box>
  );
}
