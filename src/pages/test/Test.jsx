import { StyledCard } from '@/components';
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
              <StyledCard height={200} p={2}>
                <Typography align="center" mt={-1}>
                  Historical current month scores
                </Typography>
                <BarChartHorizontal />
              </StyledCard>
              <StyledCard height={100} p={2}>
                <Typography>Gaps and things</Typography>
              </StyledCard>
            </Stack>
          </Grid>
          <Grid item sm={7} md={8}>
            <StyledCard height={316} p={2}>
              <BarChartExample />
            </StyledCard>
          </Grid>

          <Grid item sm={12} md={12}>
            <StyledCard height={300} p={2}>
              <LineChartExample />
            </StyledCard>
          </Grid>
          {/* <Grid item sm={12} md={6}>
            {favorites.map((favorite) => (
              <div key={favorite.name}>
                <Link to={favorite.path}>{favorite.name}</Link>
              </div>
            ))}
          </Grid> */}
          <Grid item sm={12} md={12}>
            <StyledCard p={2}>
              todo: style table
              <TableTest />
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Test;
