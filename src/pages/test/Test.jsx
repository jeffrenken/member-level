import Card from '@/components/Card';
import BarChartExample from '@/components/charts/BarChart';
import BarChartHorizontal from '@/components/charts/BarChartHorizontal';
import LineChartExample from '@/components/charts/LineChart';
import TopFilters from '@/components/inputs/TopFilters';
import { favoritesState } from '@/state/favoritesAtom';
import TableTest from '@/tables/TanStackTestTable';
import { Container, Grid, Stack, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';

const Test = () => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  return (
    <>
      <Container maxWidth="xl" sx={{ mb: 3, mt: 3 }}>
        <TopFilters />

        <Grid container spacing={2} mt={1}>
          <Grid item sm={5} md={4}>
            <Stack spacing={2}>
              <Card height={200} p={2}>
                <Typography align="center" mt={-1}>
                  Historical current month scores
                </Typography>
                <BarChartHorizontal />
              </Card>
              <Card height={100} p={2}>
                <Typography>Gaps and things</Typography>
              </Card>
            </Stack>
          </Grid>
          <Grid item sm={7} md={8}>
            <Card height={316} p={2}>
              <BarChartExample />
            </Card>
          </Grid>

          <Grid item sm={12} md={12}>
            <Card height={300} p={2}>
              <LineChartExample />
            </Card>
          </Grid>
          {/* <Grid item sm={12} md={6}>
            {favorites.map((favorite) => (
              <div key={favorite.name}>
                <Link to={favorite.path}>{favorite.name}</Link>
              </div>
            ))}
          </Grid> */}
          <Grid item sm={12} md={12}>
            <Card p={2}>
              todo: style table
              <TableTest />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Test;
