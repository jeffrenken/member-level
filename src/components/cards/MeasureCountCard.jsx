import { Card, CardContent, Typography, Box, useTheme, Stack, Skeleton } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSrfScores } from '@/api/useSrfScores';
import { Link, useSearchParams } from 'react-router-dom';
import './measure-count-card.css';
import { IconArrowRight } from '@tabler/icons-react';

const lightBlue = 'rgb(222, 237, 252, 1)';

export default function MeasureCountCard({ label, measures, size, isLoading }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = useTheme();

  const isLg = size === 'lg';
  const width = isLg ? 300 : 200;

  const background = theme.palette.background.paper;

  const content = (
    <Box className="measure-count-card-page-container">
      <Card
        sx={{ width: width, height: width, backgroundColor: 'transparent', cursor: 'pointer' }}
        className={`measure-count-card-card-container ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <Box
          className="front"
          sx={{ borderRadius: '10px', border: `2px solid #aaa`, bgcolor: background, boxShadow: '0px 4px 8px rgb(0 0 0 / 0.2)' }}
        >
          <Stack direction="column" justifyContent="center" alignItems="space-between" sx={{ height: '100%' }} spacing={0}>
            <Stack direction={'row'} justifyContent="space-between" alignItems="center" px={2}>
              {label && (
                <Typography sx={{ fontWeight: 600 }} align="left">
                  {label}
                </Typography>
              )}
              <IconArrowRight size={16} />
            </Stack>
            <Typography align="center" sx={{ fontSize: isLg ? '10rem' : '7rem', fontWeight: 600, lineHeight: '8rem' }}>
              {measures.length}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: isLg ? '1.3rem' : '1rem' }} align="center">
              measures
            </Typography>
          </Stack>
        </Box>

        <Box className="back" sx={{ bgcolor: background, borderRadius: '10px', border: `1px solid #aaa`, overflow: 'auto', p: 1 }}>
          {label && (
            <Typography sx={{ fontWeight: 600 }} align="left">
              {label}
            </Typography>
          )}
          <Stack direction="column" sx={{ height: '100%' }} spacing={0.4} mt={0}>
            <ul style={{ paddingInlineStart: 20 }}>
              {measures.map((measure) => (
                <li>
                  <Typography sx={{ fontSize: '0.7rem' }}>{measure['Measure Name']}</Typography>
                </li>
              ))}
            </ul>
          </Stack>
        </Box>
      </Card>
    </Box>
  );

  if (isLoading) {
    return <Skeleton variant="rounded">{content}</Skeleton>;
  }

  return content;
}
