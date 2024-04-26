import useFilteredMembers from '@/api/useFilteredMembers';
import useProviders from '@/api/useProviders';
import AgGrid from '@/components/tables/AgGrid';
import {
  GapRenderer,
  ProviderLinkRenderer,
  RatingRenderer,
  TextRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { providerFilterState } from '@/state/providerFilterState';
import useProviderGroups from '@/api/useProvidersGroups';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function ProviderGroupsPage() {
  const params = useParams();
  const selectedProvider = useRecoilValue(providerFilterState);
  const { filteredMembers: memberData } = useFilteredMembers();
  const { data: providers } = useProviders();
  const { data: providerGroups } = useProviderGroups();

  const providerGroup = useMemo(() => {
    if (!providerGroups) {
      return null;
    }
    return providerGroups.find((provider) => {
      return provider.id === selectedProvider;
    });
  }, [providerGroups, selectedProvider]);

  const rows = useMemo(() => {
    if (!providers.length || !memberData.length) {
      return [];
    }
    let filteredProviders = [...providers];
    if (providerGroup) {
      filteredProviders = filteredProviders.filter((provider) => provider['Provider Group'] === providerGroup.label);
    }

    return filteredProviders.map((provider) => {
      const providerMembers = memberData.filter((member) => member.providerGroup.Provider === provider.Provider);
      let memberGaps = 0;
      providerMembers.forEach((member) => {
        memberGaps = memberGaps + member.measuresOpen.length;
      });
      return {
        ...provider,
        providerGroupName: provider['Provider Group'],
        numberOfGaps: memberGaps,
        starRating: randomHalfNumberBetween(0, 10),
        providerUrl: `/providers/${provider.Provider}`
      };
    });
  }, [providers, memberData, providerGroup]);

  const columnDefs = [
    {
      field: 'providerGroupName',
      headerName: 'Provider Group',
      filter: true,
      chartDataType: 'category',
      maxWidth: 200,
      cellRenderer: TextRenderer
      //rowGroup: true,
      //hide: false
    },

    {
      field: 'Provider',
      headerName: 'Provider',
      filter: true,
      chartDataType: 'series',
      cellRenderer: ProviderLinkRenderer,
      enableRowGroup: true
      //hide: true
    },

    {
      field: 'numberOfGaps',
      headerName: 'Total Gaps-in-Care',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      enableRowGroup: true,
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
      enableRowGroup: true,

      valueGetter: (params) => {
        return getSparklineData(params.data?.numberOfGaps);
      }
    },
    {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      enableRowGroup: true,
      cellRenderer: RatingRenderer
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['contract', 'provider']} />
      <Typography variant="h2" mt={3}>
        Provider Groups
      </Typography>
      <Box sx={{ height: 'calc(100vh - 250px)' }}>
        <AgGrid columnDefs={columnDefs} rowData={rows} csvDownload={true} rowGroupPanelShow="always" groupDisplayType="groupRows" />
      </Box>
    </Container>
  );
}
