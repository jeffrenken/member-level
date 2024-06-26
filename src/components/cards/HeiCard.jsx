import { useTheme } from '@/hooks';
import { Box, StyledCard, Skeleton, Stack, Typography } from '@/components';
import { motion } from 'framer-motion';
import { useState } from 'react';

const lightBlue = 'rgb(222, 237, 252, 1)';

const sizeStyles = {
  sm: { width: 160, fontSize: '3.5rem', lineHeight: '4rem' },
  md: { width: 200, fontSize: '5rem', lineHeight: '5rem' },
  lg: { width: 300, fontSize: '10rem', lineHeight: '5rem' }
};

export default function HeiCard({ title, content, isLoading, color, size = 'md', ...props }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = useTheme();

  const isLg = size === 'lg';
  const styles = sizeStyles[size];

  const background = theme.palette.background.paper;

  const card = (
    <StyledCard {...props} sx={{ width: styles.width, height: styles.width, backgroundColor: 'transparent', textDecoration: 'none' }}>
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
          <motion.div key={content} initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}>
            <Typography
              align="center"
              sx={{
                fontSize: styles.fontSize,
                fontWeight: 600,
                lineHeight: styles.lineHeight,
                color: color,
                letterSpacing: '-2px'
              }}
            >
              {content}
            </Typography>
          </motion.div>
          <Typography sx={{ fontWeight: 500, fontSize: '1rem' }} align="center">
            {' '}
          </Typography>
        </Stack>
      </Box>
    </StyledCard>
  );

  if (isLoading) {
    return <Skeleton variant="rounded">{card}</Skeleton>;
  }

  return card;
}
