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

export default function Measure() {
  const theme = useTheme();
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measuresData, isLoading } = useMeasures();
  const measureFilterId = useRecoilValue(measureFilterState);
  const [srf, setSrf] = useRecoilState(srfFilterState);
  const measureId = measureFilterId || id;
  //const [chartData, setChartData] = useState({});
  const { filteredMembers } = useFilteredMembers();

  console.log(measureId);

  const measures = useMemo(() => {
    if (!measuresData) {
      return [];
    }
    const m = measuresData.find((measure) => {
      return measure.id === measureId;
    });

    return [m];
  }, [measuresData, measureId]);

  console.log(measures);

  const { members, chartData } = useMembersFilteredByMeasures(filteredMembers, measures);
  console.log({ members, chartData });

  useEffect(() => {
    setSrf(0);
  }, []);

  const measureWithData = useMemo(() => {
    if (!measuresData || !members) {
      return null;
    }
    let measureCopy = { ...measuresData[0] };
    measureCopy.numerator = members.numerator.length;
    measureCopy.denominator = members.denominator.length + members.numerator.length;
    measureCopy.forecast = 'N/A';
    return measureCopy;
  }, [measuresData, measureId, members, srf]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['provider', 'contract', 'measure']} />
      <Stack direction="row" justifyContent="space-around" alignItems={'center'} spacing={4}>
        <Box>
          <Typography variant="h1">{measureWithData?.label}</Typography>
          <Typography>Members with Open Gaps</Typography>
          <Typography mt={2}>{measureWithData?.description}</Typography>
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
        <Box>{measureWithData && <PieChart2 measure={measureWithData} disabled chart="gradient" />}</Box>
        {/*         <CardGlow measure={measureWithData} colors={[background]} disabled />}</Box>
         */}{' '}
      </Stack>
      <Box mt={3} />
      <MembersByMeasureTable rows={members?.denominator} />
    </Container>
  );
}
