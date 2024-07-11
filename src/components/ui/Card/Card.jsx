import { Box } from '@/components/ui';
import { Card as MuiCard } from '@mui/material';

export function Card(props) {
  return <MuiCard {...props} />;
}

export function StyledCard({ children, height = '100%', style, ...props }) {
  return (
    <Box
      height={height}
      sx={(theme) => ({
        bgcolor: theme.palette.background.semiTransparent2,
        borderRadius: '10px',
        border: theme.palette.border,
        ...style
      })}
      {...props}
    >
      {children}
    </Box>
  );
}
