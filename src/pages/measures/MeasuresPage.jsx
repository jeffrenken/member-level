import useContracts from '@/api/useContracts';
import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import useMemberMeasures from '@/api/useMemberMeasures';
import useMembers from '@/api/useMembers';
import useProviderGroups from '@/api/useProvidersGroups';
import useSrf from '@/api/useSrf';
import Card from '@/components/Card';
import CardGlow from '@/components/cards/card-glow/CardGlow';
import PieChart from '@/components/charts/TestPie';
import PieChart2 from '@/components/charts/TestPie2';
import PieChart3 from '@/components/charts/TestPie3';
import Donut from '@/components/charts/donut/Donut';
import Top from '@/layout/Top';
import { contractFilterState } from '@/state/contractFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { Box, Container, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import MeasureCountCard from '@/components/cards/MeasureCountCard';

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

const blue = 'rgba(146, 208,242, 1)';
const purple = 'rgba(204, 181,250, 1)';

const green = '#50CEB2';
const red = '#F36959';

const MeasuresPage = () => {
  //const UPDATE = useGlowPointer();
  const theme = useTheme();
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const providerId = useRecoilValue(providerFilterState);
  const contractId = useRecoilValue(contractFilterState);
  const srfId = useRecoilValue(srfFilterState);
  const { data: measuresData } = useMeasures();
  const { data: membersData } = useMembers();
  const { data: providerGroups } = useProviderGroups();
  const { data: memberMeasures } = useMemberMeasures();
  const { data: contracts } = useContracts();
  const { data: srfData } = useSrf();
  const { filteredMembers } = useFilteredMembers();

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

  /* const provider = useMemo(() => {
    if (!providers) {
      return null;
    }
    return providers.find((provider) => {
      return provider.id === providerId;
    });
  }, [providers, providerId]); */

  const measures = useMemo(() => {
    if (!filteredMembers.length) {
      return [];
    }

    let filtered = [...measuresData];
    if (measureStatus !== 'all') {
      filtered = filtered.filter((measure) => measure.status === measureStatus);
    }

    let splitMembers = [];
    filtered.forEach((measure, i) => {
      const numerator = filteredMembers.filter((member) => member?.memberMeasures[measure['Measure Name']] === 1).length;
      const denominator = filteredMembers.filter((member) => member?.memberMeasures[measure['Measure Name']] === 0).length;
      splitMembers[i] = { ...measure };
      splitMembers[i].numerator = numerator;
      splitMembers[i].denominator = numerator + denominator;
      splitMembers[i].forecast = 'N/A';
    });

    return splitMembers.sort((a, b) => b.abbreviation - a.abbreviation);
  }, [filteredMembers, srfId, measureStatus, measuresData]);

  const onTrack4 = measures.slice(0, 4);
  const onTrack5 = measures.slice(4, 8);
  const offTrack = measures.slice(8, measures.length);

  return (
    <Container maxWidth="xl" sx={{ marginBottom: '100px', marginTop: '20px' }}>
      <Top filters={['contracts', 'providers', 'srf', 'measureStatus']} />
      {/* <Box height={400}>
        <LineChart />
      </Box> */}
      {/* <Box height={600}>
        <BarChart measures={measures} />
      </Box> */}

      <Stack direction="row" alignItems="center" justifyContent="space-around" mb={4} px={0} mt={4}>
        <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={3} mx={6}>
          <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1} pt={8}>
            <MeasureCountCard measures={onTrack4} label={'On Track - 4 Stars'} color={green} />
            <MeasureCountCard measures={onTrack5} label={'On Track - 5 Stars'} color={green} />
            <MeasureCountCard measures={offTrack} label={'Off Track'} color={red} />
          </Stack>
          <Box px={0}>
            <Typography align="center" my={2} ml={2} sx={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '2px' }}>
              Measure Overview
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600 }}>
              Measure Table
            </Typography>
            <Typography align="left" variant="body1">
              The dashboard displays a comprehensive table of Medicare Stars and Display measures that can be filtered by Contract, Provider
              Group, and Member Type.
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              Color-Coded Indicators
            </Typography>
            <Typography align="left" variant="body1">
              Each measure is color-coded to show it's performance level: Green: Numerator Red: Denominator
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              Current Scores
            </Typography>
            <Typography align="left" variant="body1">
              All scores shown are the most recent data available, representing actual performance without forecasts.
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              Access Member Details
            </Typography>
            <Typography align="left" variant="body1">
              Click on any measure within the table to view detailed member-level data, providing deeper insights into specific metrics and
              performance factors.
            </Typography>
          </Box>
        </Stack>

        {/* <CardGlow measure={sampleMeasure} colors={[background]} disabled />
        <PieChart2 measure={sampleMeasure} disabled /> */}
      </Stack>
      <Box sx={{ borderBottom: `1px solid #aaa`, margin: '0 auto', width: '95%' }} />
      <Typography align="center" mt={3} ml={2} sx={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '2px' }}>
        Current Measure Performance
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} mb={3} mt={1}>
        <Box sx={{ backgroundColor: green, borderRadius: '6px', color: '#fff' }} px={2} py={0.7}>
          <Typography>Numerator</Typography>
        </Box>
        <Box sx={{ backgroundColor: red, borderRadius: '6px', color: '#fff' }} px={2} py={0.7}>
          <Typography>Denominator</Typography>
        </Box>
      </Stack>
      <Grid2 container spacing={2} sx={{ margin: '0 auto', mb: 3 }}>
        {measures?.map((measure) => (
          <Grid key={measure.id} m={1.35}>
            <PieChart2 measure={measure} />
          </Grid>
        ))}
      </Grid2>
      {/* <Grid2 container spacing={2} sx={{ margin: '0 auto' }}>
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
              <PieChart3 measure={measure} />
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
      </Grid2> */}

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
