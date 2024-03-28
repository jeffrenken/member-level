import { Box, useTheme } from '@mui/material';

export default function Card({ children, height = '100%', style, ...props }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box
      height={height}
      sx={(theme) => ({
        bgcolor: theme.palette.background.semiTransparent,
        borderRadius: '10px',
        border: isDarkMode ? '1px solid #2d3748' : '1px solid #e2e8f0',
        ...style
      })}
      {...props}
    >
      {children}
    </Box>
  );
}
