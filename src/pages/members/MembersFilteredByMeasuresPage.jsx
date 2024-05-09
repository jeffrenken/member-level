import useFilteredMeasures from '@/api/useFilteredMeasures';
import useFilteredMembers from '@/api/useFilteredMembers';
import useMembersFilteredByMeasures from '@/api/useMembersFilteredByMeasures';
import MeasuresAutocomplete from '@/components/MeasuresAutocomplete';
import HeiCard from '@/components/cards/HeiCard';
import BarChart from '@/components/charts/BarChart';
import MembersByMeasureTable from '@/components/tables/MembersByMeasureTable';
import Top from '@/layout/Top';
import { measuresFilterState } from '@/state/measuresFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { Box, Container, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

const filters = ['providerGroup', 'contract', 'measureStatus'];

export default function MembersFilteredByMeasuresPage() {
  const theme = useTheme();
  const { data: measuresData, isLoading } = useFilteredMeasures();
  const measureIds = useRecoilValue(measuresFilterState);
  const [srf, setSrf] = useRecoilState(srfFilterState);
  //const [chartData, setChartData] = useState({});
  const { filteredMembers } = useFilteredMembers(filters);

  const measures = useMemo(() => {
    if (!measuresData || !measureIds.length) {
      return [];
    }
    return measuresData.filter((measure) => measureIds.includes(measure.id));
  }, [measuresData, measureIds]);

  const { members } = useMembersFilteredByMeasures(filteredMembers, measures);

  useEffect(() => {
    setSrf(0);
  }, []);

  const chartData = useMemo(() => {
    if (!members?.all || !measuresData.length) {
      return [];
    }
    let gapCounts = [];

    measuresData.forEach((measure, i) => {
      gapCounts.push({ label: i.toString(), value: members.all.filter((member) => member.filteredNumberOfGaps === i).length });
    });
    return gapCounts;
  }, [members, measuresData]);

  const membersPercentMoreThanOneGap = useMemo(() => {
    if (!members?.all) {
      return 0;
    }
    let val = members.all.filter((member) => member.filteredNumberOfGaps > 1).length / members.all.length;
    return Math.round(val * 100) + '%';
  }, [members]);

  const membersPercentMoreThanThreeGaps = useMemo(() => {
    if (!members?.all) {
      return 0;
    }
    let val = members.all.filter((member) => member.filteredNumberOfGaps > 3).length / members.all.length;
    return Math.round(val * 100) + '%';
  }, [members]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '50px' }}>
      <Top filters={filters} />
      <Stack direction="row" alignItems={'center'} spacing={4} width={'100%'} sx={{ margin: '0 auto' }}>
        <Box>
          <Typography variant="h2" mb={3}>
            Multi-Measure
          </Typography>
          <Typography mb={3} variant="body1">
            Select multiple measures from the dropdown to identify members with open gaps across the chosen measures.
          </Typography>
        </Box>
      </Stack>
      <Grid container mt={2} justifyContent={'center'} spacing={2}>
        <Grid item md={12} lg={7}>
          <Box height={200} width={600} sx={{ margin: '0 auto' }}>
            <BarChart data={chartData.slice(0, 15)} title="Distribution of Members with Gaps" />
          </Box>
        </Grid>
        <Grid item md={12} lg={5}>
          <Stack direction="row" justifyContent={'center'} alignItems={'center'} spacing={2} pr={2}>
            <HeiCard content={membersPercentMoreThanOneGap} title={'Members with >1 Gap'} color={theme.palette.cardRed} size="md" />
            <HeiCard content={membersPercentMoreThanThreeGaps} title={'Members with 3+ Gaps'} color={theme.palette.cardRed} size="md" />
          </Stack>
        </Grid>
      </Grid>

      <Box mt={5} />
      <MeasuresAutocomplete measures={measuresData} />
      {members?.denominator && <MembersByMeasureTable rows={members?.denominator} />}
    </Container>
  );
}
