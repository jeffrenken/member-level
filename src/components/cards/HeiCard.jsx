import { Card, CardContent, Typography, Box, useTheme, Stack, Skeleton } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSrfScores } from '@/api/useSrfScores';
import { Link, useSearchParams } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';

const lightBlue = 'rgb(222, 237, 252, 1)';

export default function HeiCard({ title, content, isLoading, color }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = useTheme();

  const width = 160;

  const background = theme.palette.background.paper;

  const card = (
    <Card sx={{ width: width, height: width, backgroundColor: 'transparent' }}>
      <Box
        //className="front"
        sx={{
          borderRadius: '10px',
          border: `2px solid #aaa`,
          bgcolor: background,
          boxShadow: '0px 4px 8px rgb(0 0 0 / 0.2)',
          width: '100%',
          height: '100%',
          py: 0.5
        }}
      >
        <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }} spacing={0}>
          <Stack direction={'row'} justifyContent="space-between" alignItems="center" px={2}>
            {title && (
              <Typography sx={{ fontWeight: 600, lineHeight: '0.9rem' }} align="left">
                {title}
              </Typography>
            )}
          </Stack>
          <Typography align="center" sx={{ fontSize: '3.5rem', fontWeight: 600, lineHeight: '4rem', color: color }}>
            {content}
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '1rem' }} align="center">
            measures
          </Typography>
        </Stack>
      </Box>
    </Card>
  );

  if (isLoading) {
    return <Skeleton variant="rounded">{card}</Skeleton>;
  }

  return card;
}
