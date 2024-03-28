import useMembers from '@/api/useMembers';
import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import AgGrid from '@/components/tables/AgGrid';
import { Rating } from '@mui/material';
import { Link } from 'react-router-dom';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

const RatingRenderer = (params) => {
  return <Rating value={params.value} readOnly precision={0.5} size="small" />;
};

const SrfRenderer = (params) => {
  return params.value.toString();
  return <Chip color={params.value ? 'success' : 'error'} label={params.value.toString()} />;
};

const LinkRenderer = (params) => {
  console.log(params);
  return (
    <Link to={`/members/${params.data.id}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
      {params.value}
    </Link>
  );
};

export default function ProviderPage() {
  const params = useParams();
  const name = decodeURI(params.name);
  const { data } = useMembers();
  console.log(name);

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
      headerName: 'SRF Score',
      type: 'numericColumn',
      maxWidth: 120,
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer
    },
    {
      field: 'numberOfGaps',
      headerName: 'Number of Gaps',
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

  console.log(members);
  return (
    <Container maxWidth="lg">
      <Typography variant="h3">{name}</Typography>
      <AgGrid columnDefs={columnDefs} rowData={members} sideBar={false} csvDownload={true} sideBar />
    </Container>
  );
}
