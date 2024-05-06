import useFilteredMembers from '@/api/useFilteredMembers';
import useProviders from '@/api/useProviders';
import AgGrid from '@/components/tables/AgGrid';
import {
  DecimalRenderer,
  GapRenderer,
  ProviderLinkRenderer,
  RatingRenderer,
  TextRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import { Box, Container, Typography, Stack, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { providerFilterState } from '@/state/providerFilterState';
import useProviderGroups from '@/api/useProvidersGroups';
import Card from '@/components/Card';
import HeiCard from '@/components/cards/HeiCard';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function ProviderGroupsPage() {
  const params = useParams();
  const theme = useTheme();
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
      filteredProviders = filteredProviders.filter((provider) => provider.providerGroup === providerGroup.label);
    }

    return filteredProviders.map((provider) => {
      const providerMembers = memberData.filter((member) => member.providerGroup.Provider === provider.value);
      let memberGaps = 0;
      providerMembers.forEach((member) => {
        memberGaps = memberGaps + member.measuresOpen.length;
      });
      return {
        ...provider,
        providerGroupName: provider.providerGroup,
        numberOfGaps: memberGaps,
        starRating: randomHalfNumberBetween(0, 10),
        providerUrl: `/providers/${provider.value}`
      };
    });
  }, [providers, memberData, providerGroup]);

  const topProviderGroups = useMemo(() => {
    if (!providerGroups.length) {
      return [];
    }
    const sorted = providerGroups.sort((a, b) => a.avgGapsPerMember - b.avgGapsPerMember).slice(0, 10);
    return sorted;
  }, [providerGroups]);
  const topProviders = useMemo(() => {
    if (!providers.length) {
      return [];
    }
    const sorted = providers.sort((a, b) => a.avgGapsPerMember - b.avgGapsPerMember).slice(0, 10);
    return sorted;
  }, [providers]);
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
      field: 'label',
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
      field: 'avgGapsPerMember',
      headerName: 'Gaps per Member',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      enableRowGroup: true,
      cellRenderer: DecimalRenderer
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['contract', 'provider']} />

      <Stack direction="row" alignItems={'center'} justifyContent={'center'} spacing={3} sx={{ marginTop: '20px' }}>
        <Typography variant="h2" mt={3} pr={6}>
          Provider Groups
        </Typography>
        <Card
          height={200}
          width={200}
          p={1}
          style={{ overflowY: 'auto', border: `2px solid #aaa`, backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4" mb={1} sx={{ lineHeight: 0.9 }}>
            Top Provider Groups
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>
          <table>
            <tbody>
              {topProviderGroups.map((providerGroup) => (
                <tr key={providerGroup.id}>
                  <td>{providerGroup.label}</td>
                  <td>{providerGroup.avgGapsPerMember.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card
          height={200}
          width={200}
          p={1}
          style={{ overflowY: 'auto', border: `2px solid #aaa`, backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4" mb={1} sx={{ lineHeight: 0.9 }}>
            Top Providers
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>

          <table>
            <tbody style={{ overflowY: 'auto' }}>
              {topProviders.map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.label}</td>
                  <td>{provider.avgGapsPerMember.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <HeiCard content={'14%'} title={'Members Unattributed'} color={theme.palette.text.primary} />,
      </Stack>
      <Box sx={{ height: 'calc(100vh - 250px)' }}>
        <AgGrid columnDefs={columnDefs} rowData={rows} csvDownload={true} rowGroupPanelShow="always" groupDisplayType="groupRows" />
      </Box>
    </Container>
  );
}
