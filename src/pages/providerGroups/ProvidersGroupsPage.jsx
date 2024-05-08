import useFilteredMembers from '@/api/useFilteredMembers';
import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProviders';
import useProviderGroups from '@/api/useProvidersGroups';
import Card from '@/components/Card';
import AgGrid from '@/components/tables/AgGrid';
import {
  DecimalRenderer,
  GapRenderer,
  ProviderLinkRenderer,
  TextRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import { providerFilterState } from '@/state/providerFilterState';
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

function getRandomNumberBetween(min = 0, max = 2) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const filters = ['contract', 'providerGroup'];

export default function ProviderGroupsPage() {
  const theme = useTheme();
  const selectedProvider = useRecoilValue(providerFilterState);
  const { filteredMembers: memberData } = useFilteredMembers(filters);
  const { data: providers } = useProviders();
  const { data: providerGroups } = useProviderGroups();
  const { data: allMembers } = useMembers();
  const membersWithoutProvider = useMemo(() => {
    if (!allMembers) {
      return null;
    }
    return allMembers.filter((member) => !member.providerGroup);
  }, [allMembers]);
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
      const providerMembers = memberData.filter((member) => member.providerGroup && member.providerGroup.Provider === provider.value);
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
    const sorted = providerGroups.sort((a, b) => a.avgGapsPerMember - b.avgGapsPerMember);
    return sorted;
  }, [providerGroups]);

  const topProviders = useMemo(() => {
    if (!providers.length) {
      return [];
    }
    const sorted = providers.sort((a, b) => a.avgGapsPerMember - b.avgGapsPerMember);
    return sorted;
  }, [providers]);

  const arrows = [
    <Box width={16} />,
    <IconArrowUpRight size={16} color={theme.palette.cardGreen} />,
    <IconArrowDownRight size={16} color={theme.palette.cardRed} />
  ];

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

  const cardWidth = 250;

  return (
    <Container maxWidth="xl" sx={{ marginTop: '20px', marginBottom: '100px' }}>
      <Top filters={filters} />

      <Stack direction="row" alignItems={'center'} justifyContent={'space-between'} spacing={3} sx={{ marginTop: '20px' }}>
        <Typography variant="h2" mt={3} pr={6}>
          Providers
        </Typography>
        <Button component={Link} to="/members/unattributed" variant="contained" sx={{ borderRadius: '16px' }}>
          View Unattributed Members ({membersWithoutProvider.length})
        </Button>
        {/* <HeiCard
          content={membersWithoutProvider.length}
          title={'Members Unattributed'}
          color={theme.palette.text.primary}
          component={Link}
          to="/members/unattributed"
        /> */}
      </Stack>
      <Stack direction="row" alignItems={'center'} justifyContent={'center'} spacing={2} sx={{ marginTop: '20px' }}>
        <Card
          height={cardWidth}
          width={cardWidth}
          p={1}
          style={{ overflowY: 'auto', border: `2px solid #aaa`, backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4" mb={1} color={theme.palette.cardGreen}>
            High Performing Provider Groups
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>
          <table style={{ width: '100%' }}>
            <tbody>
              {providerGroups
                .sort((a, b) => a.avgGapsPerMember - b.avgGapsPerMember)
                .slice(0, 10)
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>
                      <Stack direction={'row'} alignItems={'center'} spacing={0}>
                        {arrows[getRandomNumberBetween()]} {item.avgGapsPerMember.toFixed(2)}
                      </Stack>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
        <Card
          height={cardWidth}
          width={cardWidth}
          p={1}
          style={{ overflowY: 'auto', border: `2px solid #aaa`, backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4" mb={1} color={theme.palette.cardRed}>
            Low Performing Provider Groups
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>
          <table style={{ width: '100%' }}>
            <tbody>
              {providerGroups
                .sort((a, b) => b.avgGapsPerMember - a.avgGapsPerMember)
                .slice(0, 10)
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>
                      <Stack direction={'row'} alignItems={'center'} spacing={0}>
                        {arrows[getRandomNumberBetween()]} {item.avgGapsPerMember.toFixed(2)}
                      </Stack>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
        <Card
          height={cardWidth}
          width={cardWidth}
          p={1}
          style={{ overflowY: 'auto', border: `2px solid #aaa`, backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4" mb={1} color={theme.palette.cardGreen}>
            High Performing Providers
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>

          <table style={{ width: '100%' }}>
            <tbody style={{ overflowY: 'auto' }}>
              {providers
                .sort((a, b) => a.avgGapsPerMember - b.avgGapsPerMember)
                .slice(0, 10)
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>
                      <Stack direction={'row'} alignItems={'center'} spacing={0}>
                        {arrows[getRandomNumberBetween()]} {item.avgGapsPerMember.toFixed(2)}
                      </Stack>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
        <Card
          height={cardWidth}
          width={cardWidth}
          p={1}
          style={{ overflowY: 'auto', border: `2px solid #aaa`, backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4" mb={1} color={theme.palette.cardRed}>
            Low Performing Providers
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>

          <table style={{ width: '100%' }}>
            <tbody style={{ overflowY: 'auto' }}>
              {providers
                .sort((a, b) => b.avgGapsPerMember - a.avgGapsPerMember)
                .slice(0, 10)
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>
                      <Stack direction={'row'} alignItems={'center'} spacing={0}>
                        {arrows[getRandomNumberBetween()]} {item.avgGapsPerMember.toFixed(2)}
                      </Stack>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      </Stack>
      <Box sx={{ height: 'calc(100vh - 250px)' }} mt={2}>
        <AgGrid columnDefs={columnDefs} rowData={rows} csvDownload={true} rowGroupPanelShow="always" groupDisplayType="groupRows" />
      </Box>
    </Container>
  );
}
