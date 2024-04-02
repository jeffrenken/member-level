import useMeasures from '@/api/useMeasures';
import { Container, Typography, Rating } from '@mui/material';
import { useParams } from 'react-router-dom';
import AgGrid from '@/components/tables/AgGrid';
import useMembers from '@/api/useMembers';
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
  return (
    <Link to={`/members/${params.data.id}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
      {params.value}
    </Link>
  );
};

export default function Measure() {
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measures, isLoading } = useMeasures();
  const { data } = useMembers();

  const measure = measures.find((measure) => measure.id === id);

  const members = data
    .filter((member) => member[measure.measure_name] === 'FALSE')
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
      filter: true
    },
    {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">{measure?.label}</Typography>
      <Typography>Members in the denominator</Typography>
      <AgGrid columnDefs={columnDefs} rowData={members} csvDownload saveFiltersButton />
    </Container>
  );
}
