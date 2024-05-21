import useMeasures from '@/api/useMeasures';
import useMembers from '@/api/useMembers';
import Card from '@/components/Card';
import AgGrid from '@/components/tables/AgGrid';
import { LinkRenderer, MeasureRenderer, TextRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

function getValue(value) {
  if (value === 1) {
    return true;
  } else if (value === 0) {
    return false;
  } else {
    return value;
  }
}

export default function Member() {
  const { id } = useParams();
  const { data } = useMembers();
  const { data: measuresData } = useMeasures();

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
        value: getValue(member.memberMeasures[measure['Measure Name']]),
        url: `/measures/${measure.id}`
      };
    });

    return measures.filter((measure) => measure.label !== 'CONTRACT' && measure.label !== 'MEMBER ID');
  }, [member, measuresData]);

  const columnDefs = [
    { field: 'label', headerName: 'Measure', filter: true, chartDataType: 'category', maxWidth: 500, cellRenderer: LinkRenderer },
    {
      field: 'value',
      headerName: 'Status',
      maxWidth: 150,
      chartDataType: 'series',
      type: 'numericColumn',
      filter: true,
      cellRenderer: MeasureRenderer
    }
  ];

  console.log('member', member);
  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <>
      <Container maxWidth="md">
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
              <Typography sx={{ fontSize: '1rem' }}>Provider Group: {member?.providerGroup?.['Provider Group']}</Typography>
              <Typography sx={{ fontSize: '1rem' }}>Care Supervisor: {member?.supervisor}</Typography>
              <Typography sx={{ fontSize: '1rem' }}>
                Care Manager:{' '}
                <Link to={`/care-managers/${member?.careManager}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
                  {member?.careManager}
                </Link>
              </Typography>
            </Box>
          </>
        </Card>
        <Box sx={{ height: 'calc(100vh - 250px)' }} mt={2}>
          <AgGrid rowData={rows} columnDefs={columnDefs} />
        </Box>
      </Container>
    </>
  );
}
