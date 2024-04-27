import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import HeiCard from '@/components/cards/HeiCard';
import MeasureCountCard from '@/components/cards/MeasureCountCard';
import PieChart2 from '@/components/charts/TestPie2';
import Top from '@/layout/Top';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { Box, Container, Grid, Stack, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import ThresholdSelect from './components/ThresholdSelect';
import useMembersFilteredByMeasures from '@/api/useMembersFilteredByMeasures';
import { thresholdFilterState } from '@/state/thresholdFilterState';

const green = '#50CEB2';
const red = '#F36959';

function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
}

export default function HeiPage() {
  //const UPDATE = useGlowPointer();
  const theme = useTheme();
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const thresholdFilter = useRecoilValue(thresholdFilterState);
  const srfId = useRecoilValue(srfFilterState);
  const { data: measuresData } = useMeasures();

  const { filteredMembers } = useFilteredMembers();
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
      let ranges = [
        [70 - thresholdFilter, 70 + thresholdFilter],
        [82 - thresholdFilter, 82 + thresholdFilter]
      ];

      if (measure?.bottom_third_upper_limit) {
        ranges = [
          [measure?.bottom_third_upper_limit - thresholdFilter, measure?.bottom_third_upper_limit + thresholdFilter],
          [measure?.middle_third_upper_limit - thresholdFilter, measure?.middle_third_upper_limit + thresholdFilter]
        ];
      }

      const numerator = filteredMembers.filter((member) => member?.measuresClosed.includes(measure['Measure Name'])).length;
      const denominator = filteredMembers.filter((member) => member?.measuresOpen.includes(measure['Measure Name'])).length;
      const quotient = (numerator / (numerator + denominator)) * 100;

      let isCloseToNextThreshold = false;
      if (thresholdFilter) {
        ranges.forEach((range) => {
          if (inRange(quotient, range[0], range[1])) {
            isCloseToNextThreshold = true;
          }
        });
      }

      splitMembers[i] = { ...measure };
      splitMembers[i].numerator = numerator;
      splitMembers[i].denominator = numerator + denominator;
      splitMembers[i].forecast = 'N/A';
      splitMembers[i].quotient = quotient;
      splitMembers[i].isCloseToNextThreshold = isCloseToNextThreshold;
    });
    if (thresholdFilter) {
      splitMembers = splitMembers.filter((measure) => measure.isCloseToNextThreshold);
    }

    return splitMembers.sort((a, b) => b.abbreviation - a.abbreviation);
  }, [filteredMembers, srfId, measureStatus, measuresData, thresholdFilter]);

  const gridCards = [
    <HeiCard content="4" title={'Bottom Third'} color={green} />,
    <HeiCard content={'33'} title={'Middle Third'} color={green} />,
    <HeiCard content={'100%'} title={'Top Third'} color={red} />,
    <HeiCard content={'22%'} title={'SRF Percentage'} color={red} />,
    <HeiCard content={'22%'} title={'SRF By Category'} color={red} />,
    <HeiCard content={'22%'} title={'HEI Bonus Percentage'} color={red} />
  ];

  return (
    <Container maxWidth="xl" sx={{ marginBottom: '100px', marginTop: '20px' }}>
      <Top filters={['contract', 'provider', 'srf', 'measureStatus']} />
      <Box px={0}>
        <Typography align="center" my={2} ml={2} sx={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '2px' }}>
          HEI Title
        </Typography>
      </Box>
      <Grid2 container sx={{ margin: '0 auto', mb: 3 }} justifyContent={'center'}>
        {gridCards?.map((card) => (
          <Grid key={card.id} m={1}>
            {card}
          </Grid>
        ))}
      </Grid2>

      {/* <Grid2 container spacing={2} sx={{ margin: '0 auto' }}>
        <Grid2 xs={12} sm={12} md={6} item>
          <Stack direction="row" spacing={2} justifyContent={'space-around'}>
            {gridCards.slice(0, 3).map((card, i) => (
              <React.Fragment key={card.title}>{card}</React.Fragment>
            ))}
          </Stack>
        </Grid2>
        <Grid2 xs={12} sm={12} md={6} item>
          <Stack direction="row" spacing={2} justifyContent={'space-around'}>
            {gridCards.slice(0, 3).map((card, i) => (
              <React.Fragment key={card.title}>{card}</React.Fragment>
            ))}
          </Stack>
        </Grid2>
      </Grid2> */}
      <Stack direction="row" alignItems="center" justifyContent="space-around" mb={4} px={0} mt={4}>
        {/* <CardGlow measure={sampleMeasure} colors={[background]} disabled />
        <PieChart2 measure={sampleMeasure} disabled /> */}
      </Stack>
      <Box sx={{ borderBottom: `1px solid #aaa`, margin: '0 auto', width: '95%' }} />
      <Typography align="center" mt={3} ml={2} sx={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '2px' }}>
        Current HEI
      </Typography>
      <Box mb={2}>
        <ThresholdSelect />
      </Box>
      <Grid2 container spacing={2} sx={{ margin: '0 auto', mb: 3 }}>
        {measures.length ? (
          measures?.map((measure) => (
            <Grid key={measure.id} m={1.35}>
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
