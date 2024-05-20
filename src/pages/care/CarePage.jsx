import useCareManagers from '@/api/useCareManagers';
import useContracts from '@/api/useContracts';
import useFilteredMembers from '@/api/useFilteredMembers';
import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProviders';
import useProviderGroups from '@/api/useProvidersGroups';
import useSupervisors from '@/api/useSupervisors';
import Card from '@/components/Card';
import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer2, ProviderLinkRenderer, TextRenderer, TooltipRenderer, getSparklineData } from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import { contractFilterState } from '@/state/contractFilterState';
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

const filters = ['contract', 'measureStatus'];

export default function CarePage() {
  const theme = useTheme();
  const selectedProvider = useRecoilValue(providerFilterState);
  const { filteredMembers: memberData } = useFilteredMembers(filters);
  const { data: careManagers } = useCareManagers();
  const { data: supervisors } = useSupervisors();
  console.log('supervisors', supervisors);
  const { data: providers } = useProviders();
  const { data: providerGroups } = useProviderGroups();
  const { data: allMembers } = useMembers();
  const contractId = useRecoilValue(contractFilterState);
  const { data: contracts } = useContracts();

  const contract = useMemo(() => {
    if (!contracts) {
      return null;
    }
    return contracts.find((contract) => {
      return contract.id === contractId;
    });
  }, [contracts, contractId]);

  const membersWithoutProvider = useMemo(() => {
    if (!allMembers || !contract) {
      return [];
    }
    return allMembers.filter((d) => d['CONTRACT'] === contract.label && careManagers.find((m) => m['MEMBER ID'] === d['MEMBER ID']));
  }, [contract, allMembers]);

  const rows = useMemo(() => {
    if (!providers.length || !memberData.length) {
      return [];
    }

    return careManagers.map((cm) => {
      const cmMembers = memberData.filter((member) => member.careManager && member.careManager === cm.value);
      let memberGaps = 0;
      cmMembers.forEach((member) => {
        memberGaps = memberGaps + member.filteredNumberOfGaps;
      });
      return {
        ...cm,
        supervisorName: cm.supervisor,
        numberOfGaps: memberGaps,
        starRating: randomHalfNumberBetween(0, 10),
        providerUrl: `/care-managers/${cm.value}`
      };
    });
  }, [providers, memberData, careManagers]);

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
      field: 'supervisorName',
      headerName: 'Supervisor',
      filter: true,
      chartDataType: 'category',
      maxWidth: 200,
      cellRenderer: TextRenderer
      //rowGroup: true,
      //hide: false
    },

    {
      field: 'label',
      headerName: 'Care Manager',
      filter: true,
      chartDataType: 'series',
      cellRenderer: ProviderLinkRenderer,
      enableRowGroup: true
      //hide: true
    },
    {
      field: 'avgGapsPerMember',
      headerName: 'Gaps per Member',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      enableRowGroup: true,
      cellRenderer: GapRenderer2
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
      field: 'numberOfGaps',
      headerName: 'Gaps-in-Care',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      enableRowGroup: true,
      cellRenderer: TextRenderer
    }
  ];

  const cardWidth = 250;

  return (
    <Container maxWidth="xl" sx={{ marginTop: '20px', marginBottom: '100px' }}>
      <Top filters={filters} />

      <Stack direction="row" alignItems={'center'} justifyContent={'space-between'} spacing={3} sx={{ marginTop: '20px' }}>
        <Typography variant="h2" mt={3} pr={6}>
          Care Title
        </Typography>
        {/* <Button component={Link} to="/members/unattributed" variant="contained" sx={{ borderRadius: '16px' }}>
          View Unattributed Members ({membersWithoutProvider.length})
        </Button> */}
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
              {supervisors
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
              {supervisors
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
            High Performing Care Managers
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>

          <table style={{ width: '100%' }}>
            <tbody style={{ overflowY: 'auto' }}>
              {careManagers
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
            Low Performing Care Managers
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>Avg Gaps per Member</span>
          </Typography>

          <table style={{ width: '100%' }}>
            <tbody style={{ overflowY: 'auto' }}>
              {careManagers
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
