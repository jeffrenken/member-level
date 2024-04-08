import AgGrid from '@/components/tables/AgGrid';
import useMembers from '@/api/useMembers';
import { Rating, Chip, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { GapRenderer, LinkRenderer, RatingRenderer, SrfRenderer, StarRenderer } from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function MembersPage() {
  const { data } = useMembers();

  const members = data.map((member) => {
    return {
      name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
      id: member['MEMBER ID'],
      srf: randomBoolean(),
      numberOfGaps: randomIntegerBetween(0, 50),
      starRating: randomHalfNumberBetween(0, 10),
      url: `/members/${member['MEMBER ID']}`
    };
  });

  const columnDefs = [
    {
      field: 'name',
      filter: true,
      chartDataType: 'category',
      maxWidth: 200,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: LinkRenderer
    },
    {
      field: 'srf',
      headerName: 'SRF',
      type: 'numericColumn',
      maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer
    },
    {
      field: 'numberOfGaps',
      headerName: 'Gaps',
      type: 'numericColumn',
      maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
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
      <Container maxWidth="lg" sx={{ mb: 3, mt: 3 }}>
        <Top filters={['contracts', 'providers']} />
        <div>Members Page</div>
        <Box sx={{ height: 'calc(100vh - 200px)' }}>
          <AgGrid columnDefs={columnDefs} rowData={members} csvDownload saveFiltersButton />
        </Box>
      </Container>
    </>
  );
}
