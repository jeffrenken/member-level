import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        Dashboard
      </Grid>
    </Grid>
  );
};

export default Dashboard;
