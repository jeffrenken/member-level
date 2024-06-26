import { useFilteredMembers, useMeasures } from '@/api';
import MeasureCountCard from '@/components/cards/MeasureCountCard';
import PieChart2 from '@/components/charts/TestPie2';
import Top from '@/layout/Top';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { Box, Container, Grid, Stack, Typography } from '@/components';
import { useTheme } from '@/hooks';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

const redGlowBoxShadow =
  '0 0 10px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.4), 0 0 20px rgba(255, 0, 0, 0.2)';
const yellowGlowBoxShadow =
  '0 0 10px rgba(255, 255, 0, 0.6), 0 0 20px rgba(255, 255, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.4), 0 0 20px rgba(255, 255, 0, 0.2)';
const greenGlowBoxShadow =
  '0 0 10px rgba(0, 128, 0, 0.6), 0 0 20px rgba(0, 128, 0, 0.8), 0 0 20px rgba(0, 128, 0, 0.4), 0 0 20px rgba(0, 128, 0, 0.2)';

const green = '#50CEB2';
const red = '#F36959';

const filters = ['contract', 'providerGroup', 'srf', 'measureStatus'];

const MeasuresPage = () => {
  //const UPDATE = useGlowPointer();
  const theme = useTheme();
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const srfId = useRecoilValue(srfFilterState);
  const { data: measuresData } = useMeasures();
  console.log('measuresData', measuresData);

  const { filteredMembers } = useFilteredMembers(filters);

  const measures = useMemo(() => {
    if (!filteredMembers.length) {
      return [];
    }

    let filtered = [...measuresData];
    if (measureStatus !== 0) {
      filtered = filtered.filter((measure) => measure.status === measureStatus);
    }

    let splitMembers = [];
    filtered.forEach((measure, i) => {
      const closed = filteredMembers.filter((member) => member?.measuresClosed.includes(measure['Measure Name'])).length;
      const open = filteredMembers.filter((member) => member?.measuresOpen.includes(measure['Measure Name'])).length;
      splitMembers[i] = { ...measure };
      splitMembers[i].closed = closed;
      splitMembers[i].open = open;
      splitMembers[i].total = open + closed;
      splitMembers[i].forecast = 'N/A';
    });

    return splitMembers.sort((a, b) => b.abbreviation - a.abbreviation);
  }, [filteredMembers, measureStatus, measuresData]);

  const starsMeasures = useMemo(() => {
    if (!measuresData) {
      return [];
    }
    return measuresData.filter((measure) => {
      return measure.status === 1;
    });
  }, [measuresData]);

  const onTrack4 = starsMeasures.slice(0, starsMeasures.length / 3);
  const onTrack5 = starsMeasures.slice(starsMeasures.length / 4, (starsMeasures.length * 2) / 4);
  const offTrack = starsMeasures.slice((starsMeasures.length * 2) / 3, starsMeasures.length);

  return (
    <Container maxWidth="xl" sx={{ marginBottom: '100px', marginTop: '20px' }}>
      <Top filters={filters} />

      <Stack direction="row" alignItems="center" justifyContent="space-around" mb={4} px={0} mt={4}>
        <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={3} mx={0}>
          <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1} pt={8}>
            <MeasureCountCard measures={onTrack4} label={'On Track - 4 Stars'} color={green} />
            <MeasureCountCard measures={onTrack5} label={'On Track - 5 Stars'} color={green} />
            <MeasureCountCard measures={offTrack} label={'Off Track'} color={red} />
          </Stack>
          <Box px={0}>
            <Typography align="center" my={2} ml={2} variant="h2">
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
      <Typography align="center" mt={3} ml={2} variant="h2">
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
      <Grid2 container sx={{ margin: '0 auto', mb: 3 }} direction="row" justifyContent={'center'} alignItems="center">
        {measures?.map((measure) => (
          <Grid key={measure.id} m={1}>
            <PieChart2 measure={measure} chart="gradient" />
          </Grid>
        ))}
      </Grid2>
    </Container>
  );
};

export default MeasuresPage;

/*  <Card2 measure={measure} key={measure.id} colors={selectRandomColor()} /> */
