import AgGrid from '@/components/tables/AgGrid';
import useMembers from '@/api/useMembers';
import { Rating, Chip, Container, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  BooleanRenderer,
  GapRenderer,
  LinkRenderer,
  MeasureRenderer,
  RatingRenderer,
  SrfRenderer,
  StarRenderer,
  TextRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import { useMemo } from 'react';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

const memberInfoColumns = [
  'MEMBER ID',
  'CITY',
  'COUNTY',
  'STATE',
  'ZIP CODE',
  'PHONE NUMBER',
  'EMAIL ADDRESS',
  'SEX',
  'RACE',
  'ETHNICITY',
  'PRIMARY LANGUAGE'
];

export default function MembersPage() {
  const { filteredMembers } = useFilteredMembers();
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
    if (!filteredMembers) {
      return null;
    }

    return filteredMembers.map((member) => {
      return {
        firstName: member['FIRST NAME'],
        lastName: member['LAST NAME'],
        id: member['MEMBER ID'],
        srfCell: Object.keys(member.srf).length > 2 ? 'true' : 'false',
        numberOfGaps: member.numberOfGaps,
        starRating: randomHalfNumberBetween(0, 10),
        providerGroupName: member.providerGroup['Provider Group'],
        providerName: member.providerGroup['Provider'],
        url: `/members/${member['MEMBER ID']}`,
        ...member.memberMeasures,
        ...member
      };
    });
  }, [filteredMembers]);

  console.log(members);

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
      headerName: 'Gaps',
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
      field: 'providerGroupName',
      headerName: 'Provider Group',
      filter: true,
      cellRenderer: TextRenderer
    },
    {
      field: 'providerName',
      headerName: 'Provider',
      filter: true,
      cellRenderer: TextRenderer
    },
    {
      field: 'memberInfo',
      headerName: 'Member Info',
      children: memberInfoColumns.map((infoColumn) => {
        return {
          field: infoColumn,
          headerName: infoColumn,
          type: 'numericColumn',
          chartDataType: 'series',
          filter: true,
          cellRenderer: TextRenderer,
          enableRowGroup: true
        };
      })
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

  if (!members) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ mb: 3, mt: 3 }}>
        <Top filters={['contracts']} />
        <Typography variant="h2">All Members</Typography>
        <Box sx={{ height: 'calc(100vh - 200px)' }}>
          <AgGrid
            columnDefs={columnDefs}
            rowData={members}
            csvDownload
            saveFiltersButton
            rowGroupPanelShow="always"
            groupDisplayType="groupRows"
          />
        </Box>
      </Container>
    </>
  );
}
