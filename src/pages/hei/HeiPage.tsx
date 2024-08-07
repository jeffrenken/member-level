import { useFilteredMembers, useMeasures } from '@/api';
import { Box, Container, Grid, Stack, Typography } from '@/components/ui';
import HeiCard from '@/components/cards/HeiCard';
import MeasureCountCard from '@/components/cards/MeasureCountCard';
import DonutChart from '@/components/charts/DonutChart';
import PieChart2 from '@/components/charts/TestPie2';
import { useTheme } from '@/hooks';
import Navbar from '@/components/layouts/Navbar';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { thresholdFilterState } from '@/state/thresholdFilterState';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import ThresholdSelect from './components/ThresholdSelect';
import { useMeasuresWithStats } from '../../api/useMeasuresWithStats';
import { providerFilterState } from '@/state/providerFilterState';

/* const green = '#50CEB2';
const red = '#F36959';

function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
} */

const filters = ['contract', 'providerGroup', 'measureStatus'];

function HeiPage() {
  //const UPDATE = useGlowPointer();
  const theme = useTheme();
  const thresholdFilter = useRecoilValue(thresholdFilterState);
  const srf = useRecoilValue(srfFilterState);
  const providerGroupId = useRecoilValue(providerFilterState);
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const { data: measuresData } = useMeasuresWithStats({ srf, measureStatus, providerGroupId });

  const { filteredMembers } = useFilteredMembers(filters);
  const measures = useMemo(() => {
    if (!filteredMembers.length || !measuresData) {
      return [];
    }

    let filtered = measuresData.filter((measure) => measure?.top_third_upper_value);
    if (measureStatus !== 0) {
      filtered = filtered.filter((measure) => measure.status === measureStatus);
    }

    let splitMembers = [];

    let bottom_third_upper_value = 70;
    let middle_third_upper_value = 82;

    filtered.forEach((measure, i) => {
      /* let ranges = [
        [70 - thresholdFilter, 70 + thresholdFilter],
        [82 - thresholdFilter, 82 + thresholdFilter]
      ]; */

      if (measure?.bottom_third_upper_value) {
        bottom_third_upper_value = measure?.bottom_third_upper_value;
        middle_third_upper_value = measure?.middle_third_upper_value;
        /* ranges = [
          [measure?.bottom_third_upper_value - thresholdFilter, measure?.bottom_third_upper_value + thresholdFilter],
          [measure?.middle_third_upper_value - thresholdFilter, measure?.middle_third_upper_value + thresholdFilter]
        ]; */
      }

      const closed = filteredMembers.filter((member) => member.isSrf && member?.measuresClosed.includes(measure.name)).length;
      const open = filteredMembers.filter((member) => member.isSrf && member?.measuresOpen.includes(measure.name)).length;
      const quotient = (closed / (closed + open)) * 100;

      let isCloseToNextThreshold = false;
      if (thresholdFilter) {
        if (quotient < bottom_third_upper_value && quotient + thresholdFilter >= bottom_third_upper_value) {
          isCloseToNextThreshold = true;
        }
        if (quotient < middle_third_upper_value && quotient + thresholdFilter >= middle_third_upper_value) {
          isCloseToNextThreshold = true;
        }

        /* ranges.forEach((range) => {
          if (inRange(quotient, range[0], range[1])) {
            isCloseToNextThreshold = true;
          }
        }); */
      }

      splitMembers[i] = { ...measure };
      splitMembers[i].gaps_closed_count = closed;
      splitMembers[i].gaps_open_count = open;
      splitMembers[i].open = open;
      splitMembers[i].total = closed + open;
      splitMembers[i].forecast = 'N/A';
      splitMembers[i].quotient = quotient;
      splitMembers[i].isCloseToNextThreshold = isCloseToNextThreshold;
    });
    if (thresholdFilter) {
      splitMembers = splitMembers.filter((measure) => measure.isCloseToNextThreshold);
    }

    return splitMembers.sort((a, b) => b.abbreviation - a.abbreviation);
  }, [filteredMembers, srf, measureStatus, measuresData, thresholdFilter]);

  const top = measures.slice(0, 2);
  const middle = measures.slice(3, 6);
  const lower = measures.slice(6, measures.length);
  const chartData = [
    {
      value: (lower.length / measures.length) * 100,
      name: 'Bottom Third'
    },
    {
      value: (middle.length / measures.length) * 100,
      name: 'Middle Third'
    },
    {
      value: (top.length / measures.length) * 100,
      name: 'Top Third'
    }
  ];

  const srfPercent = filteredMembers.length
    ? ((filteredMembers.filter((member) => member.isSrf).length / filteredMembers.length) * 100).toFixed(0) + '%'
    : '-';

  const background = theme.palette.background.paper;

  const gridCards1 = [
    <MeasureCountCard measures={lower} label={'Bottom Third'} color={theme.palette.cardRed} size="md" />,
    <MeasureCountCard measures={middle} label={'Middle Third'} color={theme.palette.cardYellow} size="md" />,
    <MeasureCountCard measures={top} label={'Top Third'} color={theme.palette.cardGreen} size="md" />
  ];
  const gridCards2 = [
    <HeiCard content={srfPercent} title={'SRF Percentage'} color={theme.palette.text.primary} />,
    <HeiCard content={'.20'} title={'HEI Reward'} color={theme.palette.text.primary} />,
    <Box
      sx={{
        height: '200px',
        width: '200px',
        borderRadius: '10px',
        border: `2px solid #aaa`,
        bgcolor: background,
        boxShadow: '0px 4px 8px rgb(0 0 0 / 0.2)',
        py: 0
      }}
    >
      <DonutChart data={chartData} title={`% in Each Category`} />
    </Box>
  ];

  return (
    <Container maxWidth="xl" sx={{ marginBottom: '100px', marginTop: '20px' }}>
      <Navbar filters={filters} />
      <Grid container justifyContent={'center'} alignItems={'center'} spacing={2} sx={{ margin: '0 auto' }}>
        <Grid item md={12} lg={5}>
          <Box>
            <Typography align="center" mb={2} ml={2} variant="h2">
              Health Equity Index
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600 }}>
              HEI Performance
            </Typography>
            <Typography align="left" variant="body1">
              The Health Equity Index (HEI) divides measures into three performance categories. The top three boxes indicate how many
              measures you currently have in each category.
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              SRF Population Percentage
            </Typography>
            <Typography align="left" variant="body1">
              The HEI summarizes contract performance on certain Star Ratings measures among enrollees with the specified social risk
              factors (SRFs). This box indicates what percentage of your population qualifies for the HEI.
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              HEI Reward
            </Typography>
            <Typography align="left" variant="body1">
              There are three score options in the HEI scoring system - 0, .20, and .40. This box indicates your current expected HEI
              reward.
            </Typography>
            <Typography align="left" variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              Pie Chart
            </Typography>
            <Typography align="left" variant="body1">
              This chart indicates what percentage of your member population falls into each HEI performance category.
            </Typography>
          </Box>
        </Grid>
        <Grid item md={12} lg={7}>
          <Box>
            <Stack direction="row" alignItems="flex-start" justifyContent="center" spacing={1}>
              {gridCards1?.map((card, i) => <Box key={i + 'card1'}>{card}</Box>)}
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} pt={1}>
              {gridCards2?.map((card, i) => <Box key={i + 'card2'}>{card}</Box>)}
            </Stack>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: `1px solid #aaa`, margin: '0 auto', width: '95%', mt: 3 }} />
      <Typography align="center" mt={3} ml={2} variant="h2">
        Current HEI Performance
      </Typography>
      <Box mb={2}>
        <ThresholdSelect />
      </Box>
      <Grid2 container sx={{ margin: '0 auto', mb: 3 }} direction="row" justifyContent={'center'} alignItems="center">
        {measures.length ? (
          measures?.map((measure) => (
            <Grid key={measure.id} m={1}>
              <PieChart2 measure={measure} chart="progress" />
            </Grid>
          ))
        ) : (
          <Grid sx={{ width: '100%', mt: 6 }}>
            <Typography variant="h5" align="center">
              No Measures based on filters
            </Typography>
          </Grid>
        )}
      </Grid2>
    </Container>
  );
}

export const Component = HeiPage;
