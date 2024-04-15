import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProvidersGroups';
import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, RatingRenderer, SrfRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function ProviderPage() {
  const params = useParams();
  const name = decodeURI(params.name);
  const providerId = parseInt(params.id);
  const { data } = useMembers();
  const { data: providers } = useProviders();

  const provider = useMemo(() => {
    if (!providers) {
      return null;
    }
    return providers.find((provider) => {
      return provider.id === providerId;
    });
  }, [providers, providerId]);

  const members = useMemo(() => {
    if (!data || !provider) {
      return [];
    }

    return data
      .filter((member) => (member.providerGroup.id = providerId))
      .map((member) => {
        return {
          name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
          id: member['MEMBER ID'],
          srf: randomBoolean(),
          numberOfGaps: randomIntegerBetween(0, 50),
          starRating: randomHalfNumberBetween(0, 10),
          url: `/members/${member['MEMBER ID']}`
        };
      });
  }, [data, provider]);

  const columnDefs = [
    { field: 'name', filter: true, chartDataType: 'category', maxWidth: 230, cellRenderer: LinkRenderer },
    {
      field: 'srf',
      headerName: 'SRF',
      type: 'numericColumn',
      maxWidth: 120,
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer
    },
    {
      field: 'numberOfGaps',
      headerName: 'Gaps',
      type: 'numericColumn',
      maxWidth: 160,
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
    },
    {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      maxWidth: 150,
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" mt={3}>
        {provider?.label}
      </Typography>
      <Box sx={{ height: 'calc(100vh - 150px)' }}>
        <AgGrid columnDefs={columnDefs} rowData={members} sideBar={false} csvDownload={true} sideBar />
      </Box>
    </Container>
  );
}
