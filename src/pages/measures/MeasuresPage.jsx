import useMeasures from '@/api/useMeasures';
import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProviders';
import Card from '@/components/Card';
import CardGlow from '@/components/cards/card-glow/CardGlow';
import PieChart from '@/components/charts/TestPie';
import PieChart2 from '@/components/charts/TestPie2';
import Donut from '@/components/charts/donut/Donut';
import { BarChart } from '@/components/charts/nivo/Barchart';
import Top from '@/layout/Top';
import { providertFilterState } from '@/state/providerFilterState';
import { Box, Container, Grid, Stack, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

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

const useGlowPointer = () => {
  const UPDATE = React.useCallback(({ x, y }) => {
    document.documentElement.style.setProperty('--x', x.toFixed(2));
    document.documentElement.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
    document.documentElement.style.setProperty('--y', y.toFixed(2));
    document.documentElement.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
  }, []);
  React.useEffect(() => {
    document.body.addEventListener('pointermove', UPDATE);
    return () => {
      document.body.removeEventListener('pointermove', UPDATE);
    };
  }, []);
  return null;
};

const MeasuresPage = () => {
  const UPDATE = useGlowPointer();
  const theme = useTheme();
  const providerId = useRecoilValue(providertFilterState);
  const { data: measuresData } = useMeasures();
  const { data: membersData } = useMembers();
  const { data: providers } = useProviders();

  /*   useEffect(() => {
    setMeasureState(null);
  }, []); */

  const background = theme.palette.background.paper;

  /* const measures = data.map((measure) => {
    return {
      ...measure,
      numerator: members.filter((member) => member[measure.measure_name] === 'TRUE').length,
      denominator: members.filter((member) => member[measure.measure_name] === 'FALSE').length,
      forecast: 'N/A'
    };
  }); */

  const sampleMeasure = {
    id: 1,
    abbreviation: 'EM',
    label: 'Example Measure',
    numerator: 'Numerator',
    denominator: 'Denominator',
    forecast: 'something'
  };

  const provider = useMemo(() => {
    if (!providers) {
      return null;
    }
    return providers.find((provider) => {
      return provider.id === providerId;
    });
  }, [providers, providerId]);

  const measures = useMemo(() => {
    if (!measuresData.length || !membersData) {
      return null;
    }

    let membersCopy = [...membersData];

    let m = measuresData.map((member) => {
      return {
        ...member,
        name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
        id: member['MEMBER ID']
      };
    });

    if (provider) {
      membersCopy = membersCopy.filter((member) => member['Contract Entity Name'] === provider.label);
    }

    /* if (contract) {
      don't have a way to associate a contract with a member now
      return m.filter((member) => member['Contract Name'] === contract.label);
    } */
    let splitMembers = [];
    measuresData.forEach((measure, i) => {
      splitMembers[i] = { ...measure };
      splitMembers[i].numerator = membersCopy.filter((member) => member[measure.measure_name] === 'TRUE').length;
      splitMembers[i].denominator = membersCopy.filter((member) => member[measure.measure_name] === 'FALSE').length;
      splitMembers[i].forecast = 'N/A';
    });

    //remove prod, only showing with values
    splitMembers = splitMembers.filter((m) => m.numerator > 0 || m.denominator > 0);

    return splitMembers;
  }, [measuresData, provider]);

  return (
    <Container maxWidth="lg" sx={{ marginBottom: '100px', marginTop: '20px' }}>
      <Top filters={['contracts', 'providers', 'srf']} />
      {/* <Box height={400}>
        <LineChart />
      </Box> */}
      {/* <Box height={600}>
        <BarChart measures={measures} />
      </Box> */}

      <Stack direction="row" alignItems="center" justifyContent="space-around" mb={4}>
        <Box>
          <Typography align="center" my={2} ml={2} sx={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '2px' }}>
            Measures
          </Typography>
          <Typography align="center" my={2} ml={2} variant="body1">
            Maybe some kind of explanation of what this page shows.
          </Typography>
        </Box>

        <CardGlow measure={sampleMeasure} colors={[background]} disabled />
      </Stack>
      <Grid2 container spacing={2} sx={{ margin: '0 auto', mb: 3 }}>
        {measures
          ?.sort((a, b) => b.numerator - a.numerator)
          .map((measure) => (
            <Grid key={measure.id} m={1.35}>
              <PieChart2 measure={measure} />
            </Grid>
          ))}
      </Grid2>
      <Grid2 container spacing={2} sx={{ margin: '0 auto' }}>
        {measures
          ?.sort((a, b) => b.numerator - a.numerator)
          .map((measure) => (
            <Grid key={measure.id} m={1.35}>
              <PieChart measure={measure} />
            </Grid>
          ))}
      </Grid2>
      <Grid2 container spacing={2} sx={{ margin: '0 auto' }}>
        {measures
          ?.sort((a, b) => b.numerator - a.numerator)
          .map((measure) => (
            <Grid key={measure.id} m={1.35}>
              <Card height={170} style={{ width: 170 }}>
                <Typography align="center" sx={{ fontSize: '2rem', fontWeight: 600, lineHeight: 0.9, letterSpacing: '2px', mt: 1 }}>
                  {measure.abbreviation}
                </Typography>
                <Stack direction="row" justifyContent={'center'} alignItems={'center'} spacing={2}>
                  <Typography>
                    {measure.numerator}/{measure.denominator}
                  </Typography>
                  <Box sx={{ height: 90, width: 90 }}>
                    <Donut numerator={measure.numerator} denominator={measure.denominator} />
                  </Box>
                </Stack>
                <Typography align="center" sx={{ fontSize: '1.25rem', fontWeight: 400, lineHeight: 0.9, mt: 1 }}>
                  Projection: 90
                </Typography>
              </Card>
            </Grid>
          ))}
      </Grid2>
      <Grid2 container spacing={2} sx={{ margin: '0 auto' }}>
        {measures
          ?.sort((a, b) => b.numerator - a.numerator)
          .map((measure) => (
            <Grid key={measure.id} m={1.35}>
              <CardGlow shadow={redGlowBoxShadow} measure={measure} key={measure.id} colors={selectRandomColor()} />
            </Grid>
          ))}
      </Grid2>

      {/* <Stack direction="row" useFlexGap flexWrap="wrap" spacing={4}>
        {measures?.map((measure) => (
          <CardGlow shadow={redGlowBoxShadow} measure={measure} key={measure.id} colors={selectRandomColor()} />
        ))}
      </Stack> */}
    </Container>
  );
};

export default MeasuresPage;

/*  <Card2 measure={measure} key={measure.id} colors={selectRandomColor()} /> */
