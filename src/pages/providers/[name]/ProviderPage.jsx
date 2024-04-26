import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import useMembers from '@/api/useMembers';
import useProviderGroups from '@/api/useProvidersGroups';
import AgGrid from '@/components/tables/AgGrid';
import {
  GapRenderer,
  LinkRenderer,
  MeasureRenderer,
  SrfRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import { Box, Container, Typography } from '@mui/material';
import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

let moneyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;
const worthPerGap = 25;
export default function ProviderPage() {
  const { name } = useParams();
  const totalGapsRef = useRef(0);
  //const id = parseInt(params.id);
  //const { data: member } = useMember(id);
  const { data: membersData } = useMembers();
  const { data: measures } = useMeasures();

  const starsMeasures = useMemo(() => {
    if (!measures.length) {
      return [];
    }
    return measures.filter((measure) => {
      return measure.status === 'stars';
    });
  }, [measures]);

  const displayMeasures = useMemo(() => {
    if (!measures.length) {
      return [];
    }
    return measures.filter((measure) => {
      return measure.status === 'display';
    });
  }, [measures]);

  const members = useMemo(() => {
    if (!membersData.length) {
      return [];
    }
    return membersData
      .filter((member) => member.providerGroup.Provider === name)
      .map((member) => {
        const numberOfGaps = member.measuresOpen.length;
        totalGapsRef.current += numberOfGaps;

        return {
          firstName: member['FIRST NAME'],
          lastName: member['LAST NAME'],
          id: member['MEMBER ID'],
          srfCell: member.isSrf,
          numberOfGaps: numberOfGaps,
          worth: numberOfGaps * worthPerGap,
          starRating: randomHalfNumberBetween(0, 10),
          url: `/members/${member['MEMBER ID']}`,
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
      field: 'numberOfGaps',
      headerName: 'Total Gaps-in-Care',
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
      field: 'worth',
      headerName: 'Incentive',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      valueFormatter: ({ value }) => {
        return moneyFormat.format(value);
      }
    },

    {
      field: 'starsMeasures',
      headerName: 'Stars Measures',
      children: starsMeasures.map((measure) => {
        return {
          field: measure['Measure Name'],
          headerName: measure['Measure Name'],
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
          field: measure['Measure Name'],
          headerName: measure['Measure Name'],
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
            Total Gaps: {totalGapsRef.current}
          </Typography>
          <Typography variant="h4" mb={1}>
            Incentive value: {moneyFormat.format(totalGapsRef.current * worthPerGap)}
          </Typography>
        </Box>

        <Box sx={{ height: 'calc(100vh - 300px)' }}>
          <AgGrid rowData={members} columnDefs={columnDefs} />
        </Box>
      </Container>
    </>
  );
}
