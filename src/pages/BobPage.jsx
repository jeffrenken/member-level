import RechartBar from '@/components/charts/RechartBar';
import { Container, Stack, Box, Grid, useTheme, Typography } from '@mui/material';

const Card = ({ children, height = 300 }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box
      height={height}
      sx={(theme) => ({
        bgcolor: theme.palette.background.semiTransparent,
        borderRadius: '10px',
        border: isDarkMode ? '1px solid #2d3748' : '1px solid #e2e8f0'
      })}
      p={2}
    >
      {children}
    </Box>
  );
};

export default function BobPage() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="space-between" justifyContent="space-between" m={2}>
        <Typography sx={{ fontSize: '1.5rem' }}>Page Title</Typography>
        <Typography sx={{ fontSize: '1.5rem' }}>Plan Name</Typography>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <Stack direction="row" alignItems="space-between" justifyContent="space-between">
              <Box>Measures</Box>
              <Box>Most Improved</Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Stack direction="row" alignItems="space-between" justifyContent="space-between">
              <Box>Measures</Box>
              <Box>Most Declined</Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card height={400}>
            <RechartBar />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
