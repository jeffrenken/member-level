import { Container, Grid, Typography } from './ui';

const isDev = window.location.hostname === 'localhost';

export const ErrorFallback = ({ error }) => {
  if (isDev) {
    return (
      <div style={{ marginTop: '20px' }}>
        <h3>Error Details (Development Mode):</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{error.message}</pre>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return (
    <Container>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 30px)' }}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Something went wrong.
          </Typography>
          <Typography variant="body1" align="center">
            Please refresh the page or Contact Us.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
