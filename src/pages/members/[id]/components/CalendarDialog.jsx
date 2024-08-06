import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './calendar.css';
import dayjs from 'dayjs';

export function CalendarDialog({ open, onClose, member, selectedDrugName }) {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [tooltip, setTooltip] = useState({ display: 'none', top: 0, left: 0, content: '' });

  useEffect(() => {
    if (member) {
      const endDate = new Date(member.dateOfBirth);
      endDate.setFullYear(endDate.getFullYear() + 10);

      const events = member.prescriptions
        .filter((prescription) => prescription.drug_name === selectedDrugName)
        .map((prescription) => {
          const startDate = dayjs(prescription.fill_date);
          const endDate = startDate.add(prescription.days_supply, 'days');

          return {
            title: prescription.drug_name,
            start: startDate.format('YYYY-MM-DD'),
            end: endDate.format('YYYY-MM-DD'),
            allDay: true,
            color: theme.palette.cardGreen,
            calendarId: 'cal1',
            claim_number: prescription.claim_number,
            physician: prescription.prescriber_name
          };
        });

      setEvents(events);
    }
  }, [member, selectedDrugName]);

  const handleEventMouseEnter = ({ event, jsEvent }) => {
    const { pageX, pageY } = jsEvent; // Use pageX and pageY for positioning

    const content = (
      <Paper elevation={3} variant="outlined" square={false} sx={{ padding: '10px' }}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          Prescibing Physician: {event.extendedProps.physician}
        </Typography>
        <Typography sx={{ fontSize: '1rem' }}>Claim Number: {event.extendedProps.claim_number}</Typography>
      </Paper>
    );
    setTooltip({
      display: 'block',
      top: pageY - 90, // Offset from cursor
      left: pageX, // Offset from cursor
      content: content // Or any other event property you want to show
    });
  };

  const handleEventMouseLeave = () => {
    setTooltip({ display: 'none', top: 0, left: 0, content: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ height: '70%' }}>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <div style={{ position: 'relative' }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventMouseEnter={handleEventMouseEnter}
              eventMouseLeave={handleEventMouseLeave}
              height={500}
              //eventBorderColor={'#000000'}
            />
            <div
              className="calendar-tooltip"
              style={{
                display: tooltip.display,
                top: tooltip.top,
                left: tooltip.left,
                position: 'fixed' // Use fixed positioning
              }}
            >
              {tooltip.content}
            </div>
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}