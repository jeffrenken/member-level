import { useFilteredMembers, useMeasures, useMembersFilteredByMeasures } from '@/api';
import { useMeasureWithStats } from '@/api/useMeasureWithStats';
import { Box, Container, Stack, Typography } from '@/components/ui';
import GaugeChart from '@/components/charts/GaugeChart';
import PieChart2 from '@/components/charts/TestPie2';
import MembersByMeasureTable from '@/components/tables/MembersByMeasureTable';
import Navbar from '@/components/layouts/Navbar';
import { measureFilterState } from '@/state/measureFilterState';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const filters = ['providerGroup', 'contract', 'measure'];
function Measure() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : undefined;
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const providerGroupId = useRecoilValue(providerFilterState);
  const srf = useRecoilValue(srfFilterState);
  const { data: measuresData, isLoading: isLoadingMeasures } = useMeasures();
  const measureFilterId = useRecoilValue(measureFilterState);
  const measureId = measureFilterId !== null ? measureFilterId : id;
  //const [chartData, setChartData] = useState({});
  const { filteredMembers } = useFilteredMembers(filters);
  const { data: measureWithStats, isLoading: isLoadingMeasureWithStats } = useMeasureWithStats(measureId, {
    measureStatus,
    providerGroupId,
    srf
  });

  const measures = useMemo(() => {
    if (!measuresData) {
      return [];
    }
    const m = measuresData.find((measure) => {
      return measure.id === measureId;
    });

    return [m];
  }, [measuresData, measureId]);
  const { members, chartData } = useMembersFilteredByMeasures(filteredMembers, measures);

  /*   const measureWithData = useMemo(() => {
    if (!measuresData || !members) {
      return null;
    }
    let measureCopy = { ...measures[0] };
    measureCopy.closed = members.closed.length;
    measureCopy.open = members.open.length;
    measureCopy.total = members.open.length + members.closed.length;
    measureCopy.forecast = 'N/A';
    return measureCopy;
  }, [measuresData, members, measures]); */

  const isLoading = isLoadingMeasures || isLoadingMeasureWithStats;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Navbar filters={filters} />
      <Stack direction="row" justifyContent="space-around" alignItems={'center'} spacing={4}>
        <Box>
          <Typography variant="h1">{measureWithStats?.name}</Typography>
          <Typography>Members with Open Gaps</Typography>
          <Typography mt={2}>{measureWithStats?.description}</Typography>
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
        <Box>{measureWithStats && <PieChart2 measure={measureWithStats} disabled chart="gradient" />}</Box>
        {/*         <CardGlow measure={measureWithData} colors={[background]} disabled />}</Box>
         */}{' '}
      </Stack>
      <Box mt={3} />
      <MembersByMeasureTable rows={members?.open} />
    </Container>
  );
}

export const Component = Measure;
