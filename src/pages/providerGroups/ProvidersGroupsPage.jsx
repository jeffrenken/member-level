import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProviders';
import useProviderGroups from '@/api/useProvidersGroups';
import AgGrid from '@/components/tables/AgGrid';
import {
  GapRenderer,
  LinkRenderer,
  RatingRenderer,
  SrfRenderer,
  TextRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Top from '@/layout/Top';
import useFilteredMembers from '@/api/useFilteredMembers';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function ProviderGroupsPage() {
  const params = useParams();
  const name = decodeURI(params.name);
  const { filteredMembers: memberData } = useFilteredMembers();
  const { data: providerGroupsData } = useProviderGroups();
  const { data: providers } = useProviders();

  const rows = useMemo(() => {
    console.log(providers, memberData);
    if (!providers.length || !memberData.length) {
      return [];
    }

    return (
      providers
        //.filter((member) => member['Contract Entity Name'] === name)
        .map((provider) => {
          const providerMembers = memberData.filter((member) => member.providerGroup.Provider === provider.Provider);
          let memberGaps = 0;
          providerMembers.forEach((member) => {
            Object.keys(member.memberMeasures).forEach((key) => {
              if (member.memberMeasures[key] === 0) {
                memberGaps++;
              }
            });
          });
          return {
            ...provider,
            providerGroupName: provider['Provider Group'],
            srf: randomBoolean(),
            numberOfGaps: memberGaps,
            starRating: randomHalfNumberBetween(0, 10),
            url: `/providers/${provider.Provider}`
          };
        })
    );
  }, [providers, memberData]);

  const members = useMemo(() => {
    if (!memberData) {
      return [];
    }
    return (
      memberData
        //.filter((member) => member['Contract Entity Name'] === name)
        .map((member) => {
          return {
            ...member,
            providerGroupName: member.providerGroup['Provider Group'],
            providerName: member.providerGroup.Provider,
            srf: randomBoolean(),
            numberOfGaps: randomIntegerBetween(0, 50),
            starRating: randomHalfNumberBetween(0, 10),
            url: `/providers/${member.providerGroup.Provider}`
          };
        })
    );
  }, [providerGroupsData]);

  const columnDefs = [
    {
      field: 'providerGroupName',
      headerName: 'Provider Group',
      filter: true,
      chartDataType: 'category',
      maxWidth: 200,
      cellRenderer: TextRenderer,
      rowGroup: true,
      hide: true
    },
    {
      field: 'Provider',
      headerName: 'Provider',
      filter: true,
      chartDataType: 'series',
      cellRenderer: LinkRenderer
      //rowGroup: true,
      //hide: true
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
        return getSparklineData(params.data?.numberOfGaps);
      }
    },
    {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['contracts']} />
      <Typography variant="h2" mt={3}>
        Provider Groups
      </Typography>
      <Box sx={{ height: 'calc(100vh - 250px)' }}>
        <AgGrid columnDefs={columnDefs} rowData={rows} csvDownload={true} />
      </Box>
    </Container>
  );
}
