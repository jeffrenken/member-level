import useMeasures from '@/api/useMeasures';
import Card from '@/components/Card';
import CardGlow from '@/components/cards/card-glow/CardGlow';
import BarChartExample from '@/components/charts/BarChart';
import BarChartHorizontal from '@/components/charts/BarChartHorizontal';
import LineChartExample from '@/components/charts/LineChart';
import TopFilters from '@/components/inputs/TopFilters';
import { favoritesState } from '@/state/favoritesAtom';
import TableTest from '@/tables/TanStackTestTable';
import { Container, Grid, Typography, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import MeasureCard from '@/components/cards/MeasureCard';
import Card2 from '@/components/cards/Card2';

const reds = ['#f5a3a3', '#dc4242', '#fb2222'];

const yellows = ['#f5f5a3', '#f5dc42', '#f5fb22'];

const greens = ['#14620A', '#488740', '#A6DAA0'];

const redGlowBoxShadow =
  '0 0 10px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.4), 0 0 20px rgba(255, 0, 0, 0.2)';
const yellowGlowBoxShadow =
  '0 0 10px rgba(255, 255, 0, 0.6), 0 0 20px rgba(255, 255, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.4), 0 0 20px rgba(255, 255, 0, 0.2)';
const greenGlowBoxShadow =
  '0 0 10px rgba(0, 128, 0, 0.6), 0 0 20px rgba(0, 128, 0, 0.8), 0 0 20px rgba(0, 128, 0, 0.4), 0 0 20px rgba(0, 128, 0, 0.2)';

function selectRandomColor() {
  //select red, yellow or green
  const index = Math.floor(Math.random() * 3);
  if (index === 0) {
    return reds;
  } else if (index === 1) {
    return yellows;
  } else {
    return greens;
  }
}
const Dashboard = () => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const { data: measures } = useMeasures();
  return (
    <Box p={4}>
      <Container maxWidth="xl">
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={5}>
          {measures?.map((measure) => (
            <CardGlow shadow={redGlowBoxShadow} measure={measure} key={measure.id} colors={selectRandomColor()} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;

/*  <Card2 measure={measure} key={measure.id} colors={selectRandomColor()} /> */
