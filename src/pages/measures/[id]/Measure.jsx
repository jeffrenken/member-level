import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import PieChart2 from '@/components/charts/TestPie2';
import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, SrfRenderer } from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import { measureFilterState } from '@/state/measureFilterState';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import GaugeChart from '@/components/charts/GaugeChart';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function Measure() {
  const theme = useTheme();
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measures, isLoading } = useMeasures();
  const measureFilterId = useRecoilValue(measureFilterState);
  const measureId = measureFilterId || id;
  const [chartData, setChartData] = useState({});
  const { filteredMembers } = useFilteredMembers();

  const measure = useMemo(() => {
    if (!measures) {
      return null;
    }
    return measures.find((measure) => {
      return measure.id === measureId;
    });
  }, [measures, measureId]);

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

    const chartScale = [
      [measure?.bottom_third_upper_value / 100, '#d27e6f'],
      [measure?.middle_third_upper_value / 100, '#dcb05c'],
      [measure?.top_third_upper_value / 100, '#a1d99e']
    ];
    const starsValue = splitMembers.numerator.length / (splitMembers.denominator.length + splitMembers.numerator.length);
    const heiValue = starsValue * 0.4;
    setChartData({
      scale: chartScale,
      starsVale: starsValue,
      heiValue: heiValue
    });

    return splitMembers;
  }, [measure, filteredMembers]);

  const measureWithData = useMemo(() => {
    if (!measure || !members) {
      return null;
    }
    let measureCopy = { ...measure };
    measureCopy.numerator = members.numerator.length;
    measureCopy.denominator = members.denominator.length + members.numerator.length;
    measureCopy.forecast = 'N/A';
    return measureCopy;
  }, [measure, measureId, members]);

  const columnDefs = [
    {
      field: 'name',
      filter: true,
      chartDataType: 'category',
      //maxWidth: 200,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: LinkRenderer
    },
    {
      field: 'srf',
      headerName: 'SRF',
      type: 'numericColumn',
      maxWidth: 100,
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'numericColumn',
      maxWidth: 160,
      chartDataType: 'series',
      filter: true
      //cellRenderer: SrfRenderer
    },
    {
      field: 'numberOfGaps',
      headerName: 'Total Gaps',
      type: 'numericColumn',
      //maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
    }
  ];

  if (isLoading || !members) {
    return <div>Loading...</div>;
  }

  console.log(chartData);

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['providers', 'contracts', 'measures']} />
      <Stack direction="row" justifyContent="space-around" alignItems={'center'} spacing={4}>
        <Box>
          <Typography variant="h1">{measure?.label}</Typography>
          <Typography>Members with Open Gaps</Typography>
          <Typography mt={2}>{measure?.description}</Typography>
        </Box>
        <Stack direction="row" justifyContent={'flex-end'} alignItems={'center'} spacing={3} pr={2}>
          <Box>
            <Box minWidth={170} height={120}>
              <GaugeChart chartScale={chartData.scale} chartValue={chartData.starsVale} />
            </Box>
            <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
              Stars Performance
            </Typography>
          </Box>
          <Box>
            <Box minWidth={170} height={120}>
              <GaugeChart chartScale={chartData.scale} chartValue={chartData.heiValue} />
            </Box>
            <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
              Health Equity Performance
            </Typography>
          </Box>
        </Stack>
        <Box>{measureWithData && <PieChart2 measure={measureWithData} disabled />}</Box>
        {/*         <CardGlow measure={measureWithData} colors={[background]} disabled />}</Box>
         */}{' '}
      </Stack>
      <Box mt={3} />

      <AgGrid columnDefs={columnDefs} rowData={members?.denominator} csvDownload saveFiltersButton height={'calc(100vh - 370px)'} />
    </Container>
  );
}
