import memberMeasures from '@/../fakeData/member_measures.json';
import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import useMembers from '@/api/useMembers';
import useProviderGroups from '@/api/useProvidersGroups';
import useProviders from '@/api/useProvidersGroups';
import AgGrid from '@/components/tables/AgGrid';
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
import { Box, Container, Rating, Typography } from '@mui/material';
import { minWidth } from '@mui/system';
import { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

//for deciding srf, not implemented yet
/*  "DUAL ELIGIBLE": "TRUE", if true = srf
    "DISABLED": "TRUE",if true = srf
    "Low Income Subsidy Copay Level": "FALSE",if true = srf */

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function getValue(value) {
  if (value === 0) {
    return true;
  } else if (value === 1) {
    return false;
  } else {
    return value;
  }
}
const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;
const worthPerGap = 25;
export default function ProviderPage() {
  const { name } = useParams();
  const totalGapsRef = useRef(0);
  //const id = parseInt(params.id);
  //const { data: member } = useMember(id);
  const { data } = useMembers();
  const { filteredMembers } = useFilteredMembers();
  const { data: providerGroups } = useProviderGroups();
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
        const numberOfGaps = Object.keys(member.memberMeasures).filter((key) => member.memberMeasures[key] === 0).length;
        totalGapsRef.current += numberOfGaps;

        return {
          firstName: member['FIRST NAME'],
          lastName: member['LAST NAME'],
          id: member['MEMBER ID'],
          srfCell: Object.keys(member.srf).length > 2 ? 'true' : 'false',
          numberOfGaps: numberOfGaps,
          worth: numberOfGaps * worthPerGap,
          starRating: randomHalfNumberBetween(0, 10),
          url: `/members/${member['MEMBER ID']}`,
          ...member.memberMeasures,
          ...member
        };
      });
  }, [membersData]);

  /*  const provider =
    providers &&
    providers.find((provider) => {
      return provider.label === member['Contract Entity Name'];
    }); */

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
        console.log(params);
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
        return `$${value.toFixed(2)}`;
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
          <Typography variant="h3" mb={1} sx={{ fontSize: '1.75rem' }}>
            {name}
          </Typography>
          <Typography variant="h3" mb={1} sx={{ fontSize: '1.75rem' }}>
            Total Gaps: {totalGapsRef.current}
          </Typography>
          <Typography variant="h3" mb={1} sx={{ fontSize: '1.75rem' }}>
            Incentive value: ${totalGapsRef.current * worthPerGap}
          </Typography>
        </Box>

        <Box sx={{ height: 'calc(100vh - 300px)' }}>
          <AgGrid rowData={members} columnDefs={columnDefs} />
        </Box>
      </Container>
    </>
  );
}
