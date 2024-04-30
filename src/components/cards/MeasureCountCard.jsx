import { Card, CardContent, Typography, Box, useTheme, Stack, Skeleton } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSrfScores } from '@/api/useSrfScores';
import { Link, useSearchParams } from 'react-router-dom';
import './measure-count-card.css';
import { IconArrowRight } from '@tabler/icons-react';

const lightBlue = 'rgb(222, 237, 252, 1)';

const sizeStyles = {
  sm: { width: 160, fontSize: '5rem', lineHeight: '4rem' },
  md: { width: 200, fontSize: '8rem', lineHeight: '5rem' },
  lg: { width: 300, fontSize: '10rem', lineHeight: '5rem' }
};

export default function MeasureCountCard({ label, measures, size = 'md', isLoading, color }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = useTheme();

  const isLg = size === 'lg';
  const styles = sizeStyles[size];

  const background = theme.palette.background.paper;

  /*   const things = (
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
  ); */

  const content = (
    <Box className="measure-count-card-page-container">
      <Card
        sx={{ width: styles.width, height: styles.width, backgroundColor: 'transparent', cursor: 'pointer' }}
        className={`measure-count-card-card-container ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <Box
          className="front"
          sx={{ borderRadius: '10px', border: `2px solid #aaa`, bgcolor: background, boxShadow: '0px 4px 8px rgb(0 0 0 / 0.2)', py: 0.5 }}
        >
          <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }} spacing={0}>
            <Stack direction={'row'} justifyContent="space-between" alignItems="center" px={2}>
              {label && (
                <Typography sx={{ fontWeight: 600 }} align="left">
                  {label}
                </Typography>
              )}
              <IconArrowRight size={16} />
            </Stack>
            <Typography align="center" sx={{ fontSize: styles.fontSize, fontWeight: 600, lineHeight: styles.lineHeight, color: color }}>
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
