import useMembers from '@/api/useMembers';
import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import AgGrid from '@/components/tables/AgGrid';
import { Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import { SrfRenderer, LinkRenderer, RatingRenderer } from '@/components/tables/CellRenderers';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function ProviderPage() {
  const params = useParams();
  const name = decodeURI(params.name);
  const { data } = useMembers();

  const members = data
    .filter((member) => member['Contract Entity Name'] === name)
    .map((member) => {
      return {
        name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
        id: member['MEMBER ID'],
        srf: randomBoolean(),
        numberOfGaps: randomIntegerBetween(0, 50),
        starRating: randomHalfNumberBetween(0, 10)
      };
    });
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
      filter: true
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
        {name}
      </Typography>
      <Box sx={{ height: 'calc(100vh - 150px)' }}>
        <AgGrid columnDefs={columnDefs} rowData={members} sideBar={false} csvDownload={true} sideBar />
      </Box>
    </Container>
  );
}
