import Navbar from '@/components/layouts/Navbar';
import AgGrid from '@/components/tables/AgGrid';
import {
  GapRenderer,
  LinkRenderer,
  MeasureRenderer,
  ProviderLinkRenderer,
  SrfRenderer,
  TextRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import { Box, Container, Typography } from '@/components/ui';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useMeasuresWithStats } from '../../api/useMeasuresWithStats';

const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

const memberInfoColumns = [
  { label: 'Member ID', field: 'memberId' },
  { label: 'City', field: 'CITY' },
  { label: 'County', field: 'COUNTY' },
  { label: 'State', field: 'STATE' },
  { label: 'ZIP', field: 'zipCode' },
  { label: 'Phone', field: 'phoneNumber' },
  { label: 'Email', field: 'email' },
  { label: 'Sex', field: 'SEX' },
  { label: 'Race', field: 'RACE' },
  { label: 'Ethnicity', field: 'ETHNICITY' },
  { label: 'Primary Language', field: 'primaryLanguage' }
];

const srfOptions = ['Low Income Subsidy Copay Level', 'DUAL ELIGIBLE', 'DISABLED'];

export default function MembersLayout({ members: filteredMembers, title, filters }) {
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const { data: measures } = useMeasuresWithStats({ measureStatus });

  const starsMeasures = measures ? measures.filter((measure) => measure.category === 'stars') : [];
  const displayMeasures = measures ? measures.filter((measure) => measure.category === 'display') : [];

  const members = useMemo(() => {
    if (!filteredMembers) {
      return null;
    }

    return filteredMembers.map((member) => {
      return {
        firstName: member.firstName,
        lastName: member.lastName,
        srfCell: member.isSrf,
        starRating: randomHalfNumberBetween(0, 10),
        providerGroupName: member.providerGroup?.['Provider Group'] || '',
        providerName: member.providerGroup?.['Provider'] || '',
        url: `/members/${member.memberId}`,
        providerUrl: member.providerGroup ? `/providers/${member.providerGroup['Provider']}` : '',
        ...member.srf,
        ...member.memberMeasures,
        ...member
      };
    });
  }, [filteredMembers]);

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
      field: 'isSrf',
      headerName: 'SRF',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer,
      enableRowGroup: true,
      valueFormatter: ({ value }) => {
        let valueDisplay = 'SRF';
        if (value === 'false') {
          valueDisplay = 'Non-SRF';
        }
        let text = `${valueDisplay} `;
        return text;
      }
    },
    {
      field: 'filteredNumberOfGaps',
      headerName: 'Gaps-in-Care',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer,
      enableRowGroup: true
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
        if (!params.data) {
          return null;
        }
        return getSparklineData(params.data.numberOfGaps);
      }
    },
    {
      field: 'providerName',
      headerName: 'Provider',
      filter: true,
      cellRenderer: ProviderLinkRenderer,
      enableRowGroup: true
    },
    {
      field: 'providerGroupName',
      headerName: 'Provider Group',
      filter: true,
      cellRenderer: TextRenderer,
      enableRowGroup: true
    },
    {
      field: 'memberInfo',
      headerName: 'Member Info',
      children: memberInfoColumns.map((infoColumn) => {
        return {
          field: infoColumn.field,
          headerName: infoColumn.label,
          type: 'numericColumn',
          chartDataType: 'series',
          filter: true,
          cellRenderer: TextRenderer,
          enableRowGroup: true
        };
      })
    },
    {
      field: 'srfCell',
      headerName: 'SRF',

      children: srfOptions.map((srfOption) => {
        return {
          field: srfOption,
          headerName: srfOption,
          type: 'numericColumn',
          chartDataType: 'series',
          filter: true,
          cellRenderer: SrfRenderer,
          enableRowGroup: true,
          valueFormatter: ({ value }) => {
            let valueDisplay = 'Yes';
            if (value === 'false') {
              valueDisplay = 'No';
            }
            let text = `${srfOption} - ${valueDisplay} `;

            return text;
          }
        };
      })
    },
    {
      field: 'starsMeasures',
      headerName: 'Stars Measures',
      children: starsMeasures.map((measure) => {
        return {
          field: measure.name,
          headerName: measure.abbreviation + ' - ' + measure.name,
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
            let text = `${measure.abbreviation} - ${gaps}`;

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
          field: measure.name,
          headerName: measure.abbreviation + ' - ' + measure.name,
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
            let text = `${measure.abbreviation} - ${gaps}`;

            return text;
          }
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
      <Container maxWidth="xl" sx={{ mb: 10, mt: 3 }}>
        <Navbar filters={filters} />
        <Typography variant="h2">{title}</Typography>
        <Typography>
          Instructions: To navigate this screen, simply drag and drop column headers to the grouping area at the top to organize and analyze
          your data by your preferred criteria. Customize filters, sort options, and groupings to tailor the view and uncover key member
          insights quickly.
        </Typography>
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
