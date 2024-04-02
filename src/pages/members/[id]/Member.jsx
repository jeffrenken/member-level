import { Link, useParams } from 'react-router-dom';
import useMember from '@/api/useMember';
import useMembers from '@/api/useMembers';
import memberMeasures from '@/../fakeData/member_measures.json';
import AgGrid from '@/components/tables/AgGrid';
import { Box, Container, Typography, Rating } from '@mui/material';
import { IconCheckbox, IconX } from '@tabler/icons-react';

//for deciding srf, not implemented yet
/*  "DUAL ELIGIBLE": "TRUE", if true = srf
    "DISABLED": "TRUE",if true = srf
    "Low Income Subsidy Copay Level": "FALSE",if true = srf */

function getValue(value) {
  if (value === 'TRUE') {
    return true;
  } else if (value === 'FALSE') {
    return false;
  } else {
    return value;
  }
}
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

const BooleanRenderer = (params) => {
  if (params.value) {
    return <IconCheckbox color="#4caf50" />;
  } else {
    return <IconX color="#f44336" />;
  }
};

export default function Member() {
  const { id } = useParams();
  //const id = parseInt(params.id);
  //const { data: member } = useMember(id);
  const { data } = useMembers();
  const member = data.find((member) => member['MEMBER ID'] === parseInt(id));
  const rows = memberMeasures
    .filter((row) => member?.[row])
    .map((row) => {
      return {
        label: row,
        value: getValue(member[row])
      };
    });

  const columnDefs = [
    { field: 'label', filter: true, chartDataType: 'category', maxWidth: 500 },
    {
      field: 'value',
      //headerName: 'Price w/ css',
      //type: 'numericColumn',
      maxWidth: 300,
      chartDataType: 'series',
      cellDataType: 'text',
      filter: true,
      cellRenderer: BooleanRenderer
    }
  ];

  if (!member || !rows.length) {
    return <div>Member not found</div>;
  }
  return (
    <>
      <Container maxWidth="lg">
        <div>
          ### 4. Member Profile View <br /> **Personal Information:** Basic member details and health plan information. <br /> **STAR Score
          Overview:** Visual representation of the member's STAR score based on their measures. <br /> **Detailed Measures Breakdown:**
          Status of the member across different STAR measures. <br /> **Gaps in Care:** Identified gaps and recommended action plans. <br />{' '}
          **Contact and Intervention Tools:** Direct communication options and tools for managing interventions.
        </div>
        <Box my={2}>
          <Typography variant="h3" mb={1} sx={{ fontSize: '1.5rem' }}>
            {member['FIRST NAME']} {member['LAST NAME']}
          </Typography>
          <Rating value={randomHalfNumberBetween(0, 10)} readOnly precision={0.5} size="small" />
          <Typography>{member['ADDRESS']}</Typography>
          <Typography>
            {member['ADDRESS 2__1']}, {member['STATE']}
          </Typography>
          <Typography mt={2}>Date of Birth: {member['DATE OF BIRTH']}</Typography>
        </Box>
        <Box>
          <Typography>Primary Care Physician: {member['Primary Care Physician - Provider Name']}</Typography>
          <Typography>
            Contract Entity:{' '}
            <Link
              to={`/providers/${encodeURIComponent(member['Contract Entity Name'])}`}
              style={{ textDecoration: 'none', color: '#4d9fda' }}
            >
              {member['Contract Entity Name']}
            </Link>
          </Typography>
        </Box>
        <AgGrid rowData={rows} columnDefs={columnDefs} />
      </Container>
    </>
  );
}
