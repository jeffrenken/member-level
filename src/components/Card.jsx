import { Box, useTheme } from '@mui/material';

export default function Card({ children, height = '100%', style, ...props }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
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
