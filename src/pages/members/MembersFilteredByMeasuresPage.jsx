import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import PieChart2 from '@/components/charts/TestPie2';
import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, SrfRenderer } from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import { measureFilterState } from '@/state/measureFilterState';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import GaugeChart from '@/components/charts/GaugeChart';
import { srfFilterState } from '@/state/srfFilterState';
import MembersByMeasureTable from '@/components/tables/MembersByMeasureTable';
import useMembersFilteredByMeasures from '@/api/useMembersFilteredByMeasures';
import { measuresFilterState } from '@/state/measuresFilterState';
import MeasuresAutocomplete from '@/components/MeasuresAutocomplete';

export default function MembersFilteredByMeasuresPage() {
  const theme = useTheme();
  const params = useParams();
  const { data: measuresData, isLoading } = useMeasures();
  const measureIds = useRecoilValue(measuresFilterState);
  const [srf, setSrf] = useRecoilState(srfFilterState);
  //const [chartData, setChartData] = useState({});
  const { filteredMembers } = useFilteredMembers();

  console.log(measureIds);

  const measures = useMemo(() => {
    if (!measuresData || !measureIds.length) {
      return [];
    }
    return measuresData.filter((measure) => measureIds.includes(measure.id));
  }, [measuresData, measureIds]);

  console.log(measures);

  const { members, chartData } = useMembersFilteredByMeasures(filteredMembers, measures);
  console.log(members?.denominator, chartData);

  useEffect(() => {
    setSrf(0);
  }, []);

  /* 
  const members = useMemo(() => {
    if (!filteredMembers.length || !measure) {
      return null;
    }

    let m = filteredMembers.map((member) => {
      return {
        ...member,
        name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
        id: member['MEMBER ID'],
        srf: member.isSrf,
        numberOfGaps: member.measuresOpen.length,
        url: `/members/${member['MEMBER ID']}`,
        date: '2024-01-01'
      };
    });

    let splitMembers = {};
    splitMembers.all = m;

    splitMembers.numerator = m.filter((member) => member?.measuresClosed.includes(measure['Measure Name']));
    splitMembers.denominator = m.filter((member) => member?.measuresOpen.includes(measure['Measure Name']));

    let chartScale = [
      [75 / 100, '#d27e6f'],
      [82 / 100, '#dcb05c'],
      [100 / 100, '#a1d99e']
    ];

    if (measure?.bottom_third_upper_value) {
      chartScale = [
        [measure?.bottom_third_upper_value / 100, '#d27e6f'],
        [measure?.middle_third_upper_value / 100, '#dcb05c'],
        [measure?.top_third_upper_value / 100, '#a1d99e']
      ];
    }
    const starsValue = splitMembers.numerator.length / (splitMembers.denominator.length + splitMembers.numerator.length);
    const heiValue = filteredMembers.filter((member) => member.isSrf).length / filteredMembers.length;
    setChartData({
      scale: chartScale,
      starsValue: starsValue,
      heiValue: heiValue
    });

    return splitMembers;
  }, [measure, filteredMembers]); */

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['provider', 'contract', 'measures']} />
      <Stack direction="row" justifyContent="space-around" alignItems={'center'} spacing={4}>
        <Box>
          Multiselect on Measures. Shows members who have an open gap in ALL of the selected measure. Let me know if it should be an open
          gap in any of the selected measures
        </Box>
        <Stack direction="row" justifyContent={'flex-end'} alignItems={'center'} spacing={3} pr={2}>
          <Box>
            <Box minWidth={170} height={120}>
              <GaugeChart chartScale={chartData?.scale} chartValue={chartData?.starsValue} />
            </Box>
            <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
              Stars Performance
            </Typography>
          </Box>
          <Box>
            <Box minWidth={170} height={120}>
              <GaugeChart chartScale={chartData?.scale} chartValue={chartData?.heiValue} />
            </Box>
            <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
              Health Equity Performance
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Typography>Maybe measure filter below?</Typography>
      <MeasuresAutocomplete />
      <Box mt={3} />
      <MembersByMeasureTable rows={members?.denominator} />
    </Container>
  );
}
