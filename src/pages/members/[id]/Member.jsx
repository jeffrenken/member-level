import memberMeasures from '@/../fakeData/member_measures.json';
import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import useMembers from '@/api/useMembers';
import useProviders from '@/api/useProvidersGroups';
import Card from '@/components/Card';
import AgGrid from '@/components/tables/AgGrid';
import { SrfRenderer, TextRenderer, MeasureRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, Rating, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

//for deciding srf, not implemented yet
/*  "DUAL ELIGIBLE": "TRUE", if true = srf
    "DISABLED": "TRUE",if true = srf
    "Low Income Subsidy Copay Level": "FALSE",if true = srf */

function getValue(value) {
  if (value === 0) {
    return true;
  } else if (value === 1) {
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
  const { filteredMembers } = useFilteredMembers();
  const { data: measuresData } = useMeasures();
  const { data: providers } = useProviders();

  const member = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.find((member) => {
      return member['MEMBER ID'] === parseInt(id);
    });
  }, [data, id]);

  const rows = useMemo(() => {
    if (!member || !measuresData.length) {
      return [];
    }
    let measures = measuresData.map((measure) => {
      return {
        label: measure['Measure Name'],
        value: getValue(member.memberMeasures[measure['Measure Name']])
      };
    });
    /* let measures = Object.keys(member?.memberMeasures).map((key) => {
      return {
        label: key,
        value: getValue(member.memberMeasures[key])
      };
    }); */

    return measures.filter((measure) => measure.label !== 'CONTRACT' && measure.label !== 'MEMBER ID');
  }, [member, measuresData]);

  /*  const provider =
    providers &&
    providers.find((provider) => {
      return provider.label === member['Contract Entity Name'];
    }); */

  const columnDefs = [
    { field: 'label', filter: true, chartDataType: 'category', maxWidth: 500, cellRenderer: TextRenderer },
    {
      field: 'value',
      headerName: 'Status',
      //type: 'numericColumn',
      maxWidth: 150,
      chartDataType: 'series',
      type: 'numericColumn',
      filter: true,
      cellRenderer: MeasureRenderer
    }
  ];

  if (!member) {
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
        <Card p={2} mt={2}>
          <>
            <Box>
              <Typography variant="h3" mb={1} sx={{ fontSize: '1.75rem' }}>
                {member['FIRST NAME']} {member['LAST NAME']}
              </Typography>
              <Typography sx={{ fontSize: '1rem' }}>{member['ADDRESS']}</Typography>
              <Typography sx={{ fontSize: '1rem' }}>
                {member['CITY']}, {member['STATE']}
              </Typography>
              <Typography mt={2} sx={{ fontSize: '1rem' }}>
                Date of Birth: {member['DATE OF BIRTH']}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1rem' }}>
                Primary Care Physician:{' '}
                <Link to={`/providers/${member?.providerGroup?.Provider}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
                  {member?.providerGroup?.Provider}
                </Link>
              </Typography>
              <Typography sx={{ fontSize: '1rem' }}>Contract Entity: {member?.providerGroup?.['Provider Group']}</Typography>
            </Box>
          </>
        </Card>
        <Box sx={{ height: 'calc(100vh - 300px)' }}>
          <AgGrid rowData={rows} columnDefs={columnDefs} />
        </Box>
      </Container>
    </>
  );
}
