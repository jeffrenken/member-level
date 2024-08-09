import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme, Paper, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './calendar.css';
import dayjs from 'dayjs';
import { medicationCategoryColors } from './MedicationTable';

export function CalendarDialog({ open, onClose, member, selectedDrugName }) {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [tooltip, setTooltip] = useState({ display: 'none', top: 0, left: 0, content: '' });

  useEffect(() => {
    if (member) {
      const endDate = new Date(member.dateOfBirth);
      endDate.setFullYear(endDate.getFullYear() + 10);

      const events = member.prescriptions
        //.filter((prescription) => prescription.drug_name === selectedDrugName)
        .map((prescription) => {
          const startDate = dayjs(prescription.fill_date);
          const endDate = startDate.add(prescription.days_supply, 'days');

          return {
            title: prescription.drug_name,
            start: startDate.format('YYYY-MM-DD'),
            end: endDate.format('YYYY-MM-DD'),
            allDay: true,
            color: medicationCategoryColors[prescription.adherence_category] || theme.palette.primary.main,
            calendarId: 'cal1',
            claim_number: prescription.claim_number,
            physician: prescription.prescriber_name,
            drug_name: prescription.drug_name
          };
        });

      setEvents(events);
    }
  }, [member, selectedDrugName]);

  const handleEventMouseEnter = ({ event, jsEvent }) => {
    const { pageX, pageY } = jsEvent; // Use pageX and pageY for positioning

    const content = (
      <Box>
        <Typography sx={{ fontSize: '0.9rem' }}>{event.extendedProps.drug_name}</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>Prescibing Physician: {event.extendedProps.physician}</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>Claim Number: {event.extendedProps.claim_number}</Typography>
      </Box>
    );
    setTooltip({
      display: 'block',
      top: pageY - 65, // Offset from cursor
      left: pageX - 60, // Offset from cursor
      content: content
    });
  };

  const handleEventMouseLeave = () => {
    setTooltip({ display: 'none', top: 0, left: 0, content: '' });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={
        {
          //height: '70%'
        }
      }
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default
        }
      }}
    >
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <div style={{ position: 'relative' }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventMouseEnter={handleEventMouseEnter}
              eventMouseLeave={handleEventMouseLeave}
              //height={500}
              //eventBorderColor={'#000000'}
            />
            <Paper
              variant="outlined"
              square={false}
              sx={{
                display: tooltip.display,
                top: tooltip.top,
                left: tooltip.left,
                position: 'fixed',
                zIndex: 7,
                padding: '8px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              {tooltip.content}
            </Paper>
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
