import { useFilteredMembers, useMembersFilteredByMeasures, useFilteredMeasures } from '@/api';
import { Box, Container, Grid, Stack, Typography } from '@/components';
import { useTheme } from '@/hooks';
import MeasuresAutocomplete from '@/components/MeasuresAutocomplete';
import HeiCard from '@/components/cards/HeiCard';
import BarChart from '@/components/charts/BarChart';
import { GapRenderer, LinkRenderer, MeasureRenderer, SrfRenderer } from '@/components/tables/CellRenderers';
import MembersByMeasureTable from '@/components/tables/MembersByMeasureTable';
import Top from '@/layout/Top';
import { measuresFilterState } from '@/state/measuresFilterState';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';

const filters = ['providerGroup', 'contract', 'measureStatus'];

function getRandomDate() {
  const d = new Date(2015 + Math.floor(Math.random() * 7), 1 + Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 30));
  return dayjs(d).format('YYYY-MM-DD');
}

export default function MembersFilteredByMeasuresPage() {
  const theme = useTheme();
  const tableRef = useRef();
  const { data: measuresData, isLoading } = useFilteredMeasures();
  const measureIds = useRecoilValue(measuresFilterState);
  const { filteredMembers } = useFilteredMembers(filters);

  const measures = useMemo(() => {
    if (!measuresData || !measureIds.length) {
      return [];
    }
    return measuresData.filter((measure) => measureIds.includes(measure.id));
  }, [measuresData, measureIds]);

  const { members } = useMembersFilteredByMeasures(filteredMembers, measures);

  useEffect(() => {
    if (!measures.length || !tableRef.current?.api) {
      return;
    }

    tableRef.current.api.setGridOption('columnDefs', getColumns());
  }, [measures, tableRef]);

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

  const columnDefs = [
    {
      field: 'name',
      filter: true,
      chartDataType: 'category',
      maxWidth: 200,
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
      field: 'filteredNumberOfGaps',
      headerName: 'Gaps-in-Care',
      type: 'numericColumn',
      maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
    }
  ];

  function getColumns() {
    if (!measures.length) {
      return columnDefs;
    }
    const measureColumns = [];

    measures.forEach((measure, i) => {
      measureColumns.push({
        field: measure['Measure Name'],
        headerName: measure.abbreviation + ' - ' + measure['Measure Name'],
        type: 'numericColumn',
        chartDataType: 'series',
        filter: true,
        maxWidth: 160,

        cellRenderer: MeasureRenderer,
        enableRowGroup: true,
        valueFormatter: ({ value }) => {
          let gaps = 'N/A';
          if (value === '0') {
            gaps = 'Open';
          }
          if (value === '1') {
            gaps = 'Closed';
          }
          let text = `${measure['Acronym']} - ${gaps}`;

          return text;
        }
      });

      measureColumns.push({
        field: measure['Measure Name'] + '_date',
        headerName: measure.abbreviation + ' - Last Num Date',
        chartDataType: 'series',
        filter: true,
        maxWidth: 160,

        //cellRenderer: MeasureRenderer,
        enableRowGroup: true
        /* valueFormatter: ({ value }) => {
          return getRandomDate();
        } */
      });
    });

    const allColumns = [];
    allColumns.push(columnDefs[0]);
    allColumns.push(columnDefs[1]);
    allColumns.push(...measureColumns);
    allColumns.push({
      field: 'totalGapsInSelectedMeasures',
      headerName: 'Selected Gaps',
      type: 'numericColumn',
      maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
    });
    allColumns.push(columnDefs[2]);

    return allColumns;
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
      {members?.open && <MembersByMeasureTable rows={members?.open} columns={getColumns()} tableRef={tableRef} />}
    </Container>
  );
}
