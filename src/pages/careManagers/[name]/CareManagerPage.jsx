import { useMeasures, useMembers } from '@/api';

import { Box, Container, Typography } from '@/components/ui';
import AgGrid from '@/components/tables/AgGrid';
import {
  GapRenderer,
  LinkRenderer,
  MeasureRenderer,
  SrfRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

let moneyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;
const worthPerGap = 25;

function CareManagerPage() {
  const { name } = useParams();
  const totalGapsRef = useRef(0);
  //const id = parseInt(params.id);
  //const { data: member } = useMember(id);
  const { data: membersData } = useMembers();
  const { data: measures } = useMeasures();

  const starsMeasures = useMemo(() => {
    if (!measures) {
      return [];
    }
    return measures.filter((measure) => {
      return measure.category === 'stars';
    });
  }, [measures]);

  const displayMeasures = useMemo(() => {
    if (!measures) {
      return [];
    }
    return measures.filter((measure) => {
      return measure.category === 'display';
    });
  }, [measures]);

  const members = useMemo(() => {
    if (!membersData.length) {
      return [];
    }
    return membersData
      .filter((member) => member.careManager && member.careManager === name)
      .map((member) => {
        const numberOfGaps = member.measuresOpen.length;
        totalGapsRef.current += numberOfGaps;

        return {
          firstName: member.firstName,
          lastName: member.lastName,
          id: member.memberId,
          srfCell: member.isSrf,
          numberOfGaps: numberOfGaps,
          worth: numberOfGaps * worthPerGap,
          starRating: randomHalfNumberBetween(0, 10),
          url: `/members/${member.memberId}`,
          ...member.memberMeasures,
          ...member
        };
      });
  }, [membersData]);

  const columnDefs = [
    {
      field: 'firstName',
      filter: true,
      chartDataType: 'category',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: LinkRenderer
    },
    {
      field: 'lastName',
      filter: true,
      chartDataType: 'category',
      cellRenderer: LinkRenderer
    },
    {
      field: 'srfCell',
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
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
    },
    {
      field: 'chart',
      headerName: 'Change',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          xKey: 'x',
          yKey: 'y',
          type: 'line',
          tooltip: {
            renderer: TooltipRenderer
          }
        }
      },
      minWidth: 200,
      valueGetter: (params) => {
        return getSparklineData(params.data.numberOfGaps);
      }
    },

    {
      field: 'starsMeasures',
      headerName: 'Stars Measures',
      children: starsMeasures.map((measure) => {
        return {
          field: measure.name,
          headerName: measure.name,
          type: 'numericColumn',
          chartDataType: 'series',
          filter: true,
          cellRenderer: MeasureRenderer,
          enableRowGroup: true
        };
      })
    },
    {
      field: 'displayMeasures',
      headerName: 'Display Measures',
      children: displayMeasures.map((measure) => {
        return {
          field: measure.name,
          headerName: measure.name,
          type: 'numericColumn',
          chartDataType: 'series',
          filter: true,
          cellRenderer: MeasureRenderer,
          enableRowGroup: true
        };
      })
    }
    /* {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: StarRenderer
    } */
  ];

  return (
    <>
      <Container maxWidth="xl">
        <Box my={2} mt={3}>
          <Typography variant="h1" mb={1} sx={{ fontSize: '1.75rem' }}>
            {name}
          </Typography>
          <Typography variant="h4" mb={1}>
            Supervisor: {members && members[0]?.supervisor}
          </Typography>
          <Typography variant="h4" mb={1}>
            Total Gaps: {totalGapsRef.current}
          </Typography>
        </Box>

        <Box sx={{ height: 'calc(100vh - 300px)' }}>
          <AgGrid rowData={members} columnDefs={columnDefs} csvDownload={true} autoHeight={false} />
        </Box>
      </Container>
    </>
  );
}

export const Component = CareManagerPage;
