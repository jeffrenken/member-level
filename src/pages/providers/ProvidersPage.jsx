import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProviders';
import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, RatingRenderer, SrfRenderer, TextRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function ProvidersPage() {
  const params = useParams();
  const name = decodeURI(params.name);
  const { data: members } = useMembers();
  const { data: providersData } = useProviders();
  console.log(providersData);

  const providers = useMemo(() => {
    if (!providersData) {
      return [];
    }
    return (
      providersData
        //.filter((member) => member['Contract Entity Name'] === name)
        .map((provider) => {
          return {
            ...provider,
            srf: randomBoolean(),
            numberOfGaps: randomIntegerBetween(0, 50),
            starRating: randomHalfNumberBetween(0, 10),
            url: `/providers/${provider.id}`
          };
        })
    );
  }, [providersData]);

  const columnDefs = [
    {
      field: 'Contract Entity Name',
      headerName: 'Name',
      filter: true,
      chartDataType: 'category',
      maxWidth: 290,
      cellRenderer: TextRenderer,
      rowGroup: true,
      hide: true
    },
    {
      field: 'Primary Care Physician - Provider Name',
      headerName: 'Name',
      filter: true,
      chartDataType: 'category',
      maxWidth: 290,
      cellRenderer: TextRenderer,
      rowGroup: true,
      hide: true
    },
    {
      field: 'FIRST NAME',
      headerName: 'First',
      type: 'category',
      maxWidth: 160,
      chartDataType: 'series',
      filter: true,
      cellRenderer: TextRenderer
    },
    {
      field: 'LAST NAME',
      headerName: 'Last',
      type: 'category',
      maxWidth: 160,
      chartDataType: 'series',
      filter: true,
      cellRenderer: TextRenderer
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
        Providers
      </Typography>
      <Box sx={{ height: 'calc(100vh - 150px)' }}>
        <AgGrid columnDefs={columnDefs} rowData={members} csvDownload={true} sideBar />
      </Box>
    </Container>
  );
}
