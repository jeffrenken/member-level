import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import useMembersFilteredByMeasures from '@/api/useMembersFilteredByMeasures';
import MeasuresAutocomplete from '@/components/MeasuresAutocomplete';
import HeiCard from '@/components/cards/HeiCard';
import GaugeChart from '@/components/charts/GaugeChart';
import MembersByMeasureTable from '@/components/tables/MembersByMeasureTable';
import Top from '@/layout/Top';
import { measuresFilterState } from '@/state/measuresFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function MembersFilteredByMeasuresPage() {
  const theme = useTheme();
  const params = useParams();
  const { data: measuresData, isLoading } = useMeasures();
  const measureIds = useRecoilValue(measuresFilterState);
  const [srf, setSrf] = useRecoilState(srfFilterState);
  //const [chartData, setChartData] = useState({});
  const { filteredMembers } = useFilteredMembers();

  const measures = useMemo(() => {
    if (!measuresData || !measureIds.length) {
      return [];
    }
    return measuresData.filter((measure) => measureIds.includes(measure.id));
  }, [measuresData, measureIds]);

  const { members, chartData } = useMembersFilteredByMeasures(filteredMembers, measures);

  useEffect(() => {
    setSrf(0);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['provider', 'contract', 'measures']} />
      <Stack direction="row" justifyContent="space-around" alignItems={'center'} spacing={4} width={'85%'} sx={{ margin: '0 auto' }}>
        <Box>
          <Typography variant="h2" mb={3}>
            Multi-Measure
          </Typography>
          <Typography mb={3} variant="body1">
            Select multiple measures fromt he dropdown to identify members with open gaps across the chosen measures.
          </Typography>
          <MeasuresAutocomplete />
        </Box>
        <Stack direction="row" justifyContent={'flex-end'} alignItems={'center'} spacing={1} pr={2}>
          <HeiCard content={'82%'} title={'Members with Multiple Gaps'} color={theme.palette.cardRed} />,
          <HeiCard content={'43%'} title={'Members with 3+ Gaps'} color={theme.palette.cardRed} />,
        </Stack>
      </Stack>
      <Box mt={3} />
      {members?.denominator && <MembersByMeasureTable rows={members?.denominator} />}
    </Container>
  );
}
