import memberMeasures from '@/../fakeData/member_measures.json';
import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProviders';
import AgGrid from '@/components/tables/AgGrid';
import { SrfRenderer, TextRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, Rating, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

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

export default function Member() {
  const { id } = useParams();
  //const id = parseInt(params.id);
  //const { data: member } = useMember(id);
  const { data } = useMembers();
  const { data: providers } = useProviders();

  const member = data && data.find((member) => member['MEMBER ID'] === parseInt(id));
  const rows = memberMeasures
    .filter((row) => member?.[row])
    .map((row) => {
      return {
        label: row,
        value: getValue(member[row])
      };
    });

  const provider =
    providers &&
    providers.find((provider) => {
      return provider.label === member['Contract Entity Name'];
    });

  const columnDefs = [
    { field: 'label', filter: true, chartDataType: 'category', maxWidth: 500, cellRenderer: TextRenderer },
    {
      field: 'value',
      //headerName: 'Price w/ css',
      //type: 'numericColumn',
      maxWidth: 300,
      chartDataType: 'series',
      type: 'numericColumn',
      filter: true,
      cellRenderer: SrfRenderer
    }
  ];

  if (!member || !rows.length) {
    return <div>Member not found</div>;
  }
  return (
    <>
      <Container maxWidth="md">
        {/* <div>
          ### 4. Member Profile View <br /> **Personal Information:** Basic member details and health plan information. <br /> **STAR Score
          Overview:** Visual representation of the member's STAR score based on their measures. <br /> **Detailed Measures Breakdown:**
          Status of the member across different STAR measures. <br /> **Gaps in Care:** Identified gaps and recommended action plans. <br />{' '}
          **Contact and Intervention Tools:** Direct communication options and tools for managing interventions.
        </div> */}
        <Box my={2} mt={3}>
          <Typography variant="h3" mb={1} sx={{ fontSize: '1.75rem' }}>
            {member['FIRST NAME']} {member['LAST NAME']}
          </Typography>
          <Rating value={randomHalfNumberBetween(0, 10)} readOnly precision={0.5} size="small" />
          <Typography sx={{ fontSize: '1rem' }}>{member['ADDRESS']}</Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            {member['ADDRESS 2__1']}, {member['STATE']}
          </Typography>
          <Typography mt={2} sx={{ fontSize: '1rem' }}>
            Date of Birth: {member['DATE OF BIRTH']}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '1rem' }}>Primary Care Physician: {member['Primary Care Physician - Provider Name']}</Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            Contract Entity:{' '}
            <Link to={`/providers/${provider.id}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
              {member['Contract Entity Name']}
            </Link>
          </Typography>
        </Box>
        <Box sx={{ height: 'calc(100vh - 300px)' }}>
          <AgGrid rowData={rows} columnDefs={columnDefs} />
        </Box>
      </Container>
    </>
  );
}
