import { useMeasures, useMembers } from '@/api';
import AgGrid from '@/components/tables/AgGrid';
import { LinkRenderer, MeasureRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, StyledCard, Typography } from '@/components/ui';
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

function Member() {
  const { id } = useParams();
  const { data } = useMembers();
  const { data: measuresData } = useMeasures();

  const member = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.find((member) => {
      return member.memberId === parseInt(id);
    });
  }, [data, id]);

  const rows = useMemo(() => {
    if (!member || !measuresData.length) {
      return [];
    }
    let measures = measuresData.map((measure) => {
      return {
        label: measure.name,
        value: getValue(member.memberMeasures[measure.name]),
        url: `/measures/${measure.id}`
      };
    });

    return measures.filter((measure) => measure.label !== 'CONTRACT' && measure.label !== 'memberId');
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

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <>
      <Container maxWidth="md">
        <StyledCard p={2} mt={2}>
          <>
            <Box>
              <Typography variant="h3" mb={1} sx={{ fontSize: '1.75rem' }}>
                {member.firstName} {member.lastName}
              </Typography>
              <Typography sx={{ fontSize: '1rem' }}>{member.address}</Typography>
              <Typography sx={{ fontSize: '1rem' }}>
                {member.city}, {member.state}
              </Typography>
              <Typography mt={2} sx={{ fontSize: '1rem' }}>
                Date of Birth: {member.dateOfBirth}
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
        </StyledCard>
        <Box sx={{ height: 'calc(100vh - 300px)' }} mt={2}>
          <AgGrid rowData={rows} columnDefs={columnDefs} />
        </Box>
      </Container>
    </>
  );
}

export const Component = Member;
