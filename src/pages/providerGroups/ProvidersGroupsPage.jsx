import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProviders';
import useProviderGroups from '@/api/useProvidersGroups';
import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, RatingRenderer, SrfRenderer, TextRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function ProviderGroupsPage() {
  const params = useParams();
  const name = decodeURI(params.name);
  const { data: memberData } = useMembers();
  const { data: providerGroupsData } = useProviderGroups();
  const { data: providers } = useProviders();
  console.log(providers);

  const rows = useMemo(() => {
    if (!providers || !memberData) {
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
          console.log(providerMembers);
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
  }, [providerGroupsData, memberData]);

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

  console.log(rows);
  console.log(members);

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
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    }
  ];

  console.log(members);

  return (
    <Container maxWidth="xl">
      <Typography variant="h3" mt={3}>
        Provider Groups
      </Typography>
      <Box sx={{ height: 'calc(100vh - 150px)' }}>
        <AgGrid columnDefs={columnDefs} rowData={rows} csvDownload={true} sideBar />
      </Box>
    </Container>
  );
}
