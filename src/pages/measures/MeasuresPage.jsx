import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import MeasureCountCard from '@/components/cards/MeasureCountCard';
import PieChart2 from '@/components/charts/TestPie2';
import Top from '@/layout/Top';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { Box, Container, Grid, Stack, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useMemo } from 'react';
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
const blue = 'rgba(146, 208,242, 1)';
const purple = 'rgba(204, 181,250, 1)';
const green = '#50CEB2';
const red = '#F36959';

const MeasuresPage = () => {
  //const UPDATE = useGlowPointer();
  const theme = useTheme();
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const srfId = useRecoilValue(srfFilterState);
  const { data: measuresData } = useMeasures();

  const { filteredMembers } = useFilteredMembers();

  const sampleMeasure = {
    id: 1,
    abbreviation: 'EM',
    label: 'Example Measure',
    numerator: 'Numerator',
    denominator: 'Denominator',
    forecast: 'something'
  };

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
      const numerator = filteredMembers.filter((member) => member?.measuresClosed.includes(measure['Measure Name'])).length;
      const denominator = filteredMembers.filter((member) => member?.measuresOpen.includes(measure['Measure Name'])).length;
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
      <Top filters={['contract', 'provider', 'srf', 'measureStatus']} />

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
            <PieChart2 measure={measure} chart="gradient" />
          </Grid>
        ))}
      </Grid2>
    </Container>
  );
};

export default MeasuresPage;

/*  <Card2 measure={measure} key={measure.id} colors={selectRandomColor()} /> */
