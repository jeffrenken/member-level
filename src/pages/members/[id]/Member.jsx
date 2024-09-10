import { useMeasures } from '@/api';
import { useMember } from '@/api/useMember';
import AgGrid from '@/components/tables/AgGrid';
import { LinkRenderer, MeasureRenderer, MeasureTypeRenderer } from '@/components/tables/CellRenderers';
import { Box, Container, Grid, StyledCard, Typography } from '@/components/ui';
import { useTheme } from '@/hooks';
import { commentTestState } from '@/state/commentTestState';
import { Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { CalendarDialog } from './components/CalendarDialog';
import { CommentSection } from './components/CommentSection';
import { MedicationTable } from './components/MedicationTable';
import { MemberSection } from './components/MemberSection';

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
  const theme = useTheme();
  const { id } = useParams();
  const { data: member } = useMember(id);
  //const { data } = useMembers();
  const { data: measuresData } = useMeasures();
  const [selectedDrugName, setSelectedDrugName] = useState('');
  const comments = useRecoilValue(commentTestState);
  const [tab, setTab] = useState(0);

  const rows = useMemo(() => {
    if (!member || !measuresData.length) {
      return [];
    }
    let measures = measuresData
      //.filter((measure) => measure.status)
      .map((measure) => {
        return {
          ...measure,
          label: measure.name,
          value: getValue(member.memberMeasures[measure.name]),
          url: `/measures/${measure.id}`
        };
      })
      .filter((measure) => measure.value !== undefined);

    return measures.filter((measure) => measure.label !== 'CONTRACT' && measure.label !== 'memberId');
  }, [member, measuresData]);

  const columnDefs = [
    {
      field: 'category',
      headerName: 'Measure Type',
      maxWidth: 150,
      chartDataType: 'category',
      filter: true,
      cellRenderer: MeasureTypeRenderer
    },
    { field: 'label', headerName: 'Measure', filter: true, chartDataType: 'category', maxWidth: 500, cellRenderer: LinkRenderer },
    {
      field: 'value',
      headerName: 'Status',
      maxWidth: 100,
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
      <CalendarDialog
        open={Boolean(selectedDrugName)}
        onClose={() => {
          setSelectedDrugName('');
        }}
        member={member}
        selectedDrugName={selectedDrugName}
      />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={8}>
            <StyledCard p={2} mt={2} style={{ height: 'fit-content', backgroundColor: theme.palette.paper }}>
              <MemberSection member={member} />
            </StyledCard>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={(e, value) => setTab(value)} aria-label="basic tabs example">
                <Tab label="Measures" />
                <Tab label="Medications" />
              </Tabs>
            </Box>
            {tab === 0 && (
              <Box sx={{ height: 'calc(100vh - 360px)' }} mt={2}>
                <AgGrid rowData={rows} columnDefs={columnDefs} hideColumns hideFilters autoHeight={true} />
              </Box>
            )}
            {tab === 1 && (
              <Box sx={{ height: 'calc(100vh - 360px)' }} mt={2}>
                <MedicationTable medications={member.prescriptions} member={member} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Box mt={4} />
            <Typography variant="h3" my={1} align="center">
              Notes
            </Typography>
            <Box sx={{ maxHeight: 'calc(100vh - 340px)', overflow: 'auto', paddingRight: '20px' }}>
              <CommentSection
                comments={comments ? comments.filter((comment) => comment.memberId === member.memberId) : []}
                member={member}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export const Component = Member;

{
  /* <Grid item xs={5}>
                  <Grid container spacing={1}>
                    {member.prescriptions.map((prescription) => {
                      return (
                        <Grid item xs={12} key={prescription.drug_name}>
                          <Chip
                            label={prescription.drug_name}
                            onClick={() => {
                              setSelectedDrugName(prescription.drug_name);
                            }}
                            size="small"
                            color="primary"
                          />
                        </Grid>
                      );
                    })}
                  </Grid> */
}
