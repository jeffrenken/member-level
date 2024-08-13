import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { Box, Dialog, DialogContent, Paper, Stack, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './calendar.css';
import { medicationCategoryColors } from './MedicationTable';

const holidays = [
  {
    name: "New Year's Day",
    dates: [
      '2024-01-01',
      '2025-01-01',
      '2026-01-01',
      '2027-01-01',
      '2028-01-03',
      '2029-01-01',
      '2030-01-01',
      '2031-01-01',
      '2032-01-01',
      '2033-01-03'
    ]
  },
  {
    name: 'Martin Luther King Jr. Day',
    dates: [
      '2024-01-15',
      '2025-01-20',
      '2026-01-19',
      '2027-01-18',
      '2028-01-17',
      '2029-01-15',
      '2030-01-21',
      '2031-01-20',
      '2032-01-19',
      '2033-01-17'
    ]
  },
  {
    name: "Presidents' Day",
    dates: [
      '2024-02-19',
      '2025-02-17',
      '2026-02-16',
      '2027-02-15',
      '2028-02-21',
      '2029-02-19',
      '2030-02-18',
      '2031-02-17',
      '2032-02-16',
      '2033-02-21'
    ]
  },
  {
    name: 'Memorial Day',
    dates: [
      '2024-05-27',
      '2025-05-26',
      '2026-05-25',
      '2027-05-31',
      '2028-05-29',
      '2029-05-28',
      '2030-05-27',
      '2031-05-26',
      '2032-05-31',
      '2033-05-30'
    ]
  },
  {
    name: 'Juneteenth National Independence Day',
    dates: [
      '2024-06-19',
      '2025-06-19',
      '2026-06-19',
      '2027-06-18',
      '2028-06-19',
      '2029-06-19',
      '2030-06-19',
      '2031-06-19',
      '2032-06-19',
      '2033-06-19'
    ]
  },
  {
    name: 'Independence Day',
    dates: [
      '2024-07-04',
      '2025-07-04',
      '2026-07-03',
      '2027-07-05',
      '2028-07-04',
      '2029-07-04',
      '2030-07-04',
      '2031-07-04',
      '2032-07-05',
      '2033-07-04'
    ]
  },
  {
    name: 'Labor Day',
    dates: [
      '2024-09-02',
      '2025-09-01',
      '2026-09-07',
      '2027-09-06',
      '2028-09-04',
      '2029-09-03',
      '2030-09-02',
      '2031-09-01',
      '2032-09-06',
      '2033-09-05'
    ]
  },
  {
    name: 'Columbus Day',
    dates: [
      '2024-10-14',
      '2025-10-13',
      '2026-10-12',
      '2027-10-11',
      '2028-10-09',
      '2029-10-08',
      '2030-10-14',
      '2031-10-13',
      '2032-10-11',
      '2033-10-10'
    ]
  },
  {
    name: 'Veterans Day',
    dates: [
      '2024-11-11',
      '2025-11-11',
      '2026-11-11',
      '2027-11-11',
      '2028-11-10',
      '2029-11-12',
      '2030-11-11',
      '2031-11-11',
      '2032-11-11',
      '2033-11-11'
    ]
  },
  {
    name: 'Thanksgiving Day',
    dates: [
      '2024-11-28',
      '2025-11-27',
      '2026-11-26',
      '2027-11-25',
      '2028-11-23',
      '2029-11-22',
      '2030-11-28',
      '2031-11-27',
      '2032-11-25',
      '2033-11-24'
    ]
  },
  {
    name: 'Christmas Day',
    dates: [
      '2024-12-25',
      '2025-12-25',
      '2026-12-25',
      '2027-12-24',
      '2028-12-25',
      '2029-12-25',
      '2030-12-25',
      '2031-12-25',
      '2032-12-24',
      '2033-12-25'
    ]
  }
];

export function CalendarDialog({ open, onClose, member, selectedDrugName }) {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [tooltip, setTooltip] = useState({ display: 'none', top: 0, left: 0, content: '' });

  useEffect(() => {
    if (member) {
      const endDate = new Date(member.dateOfBirth);
      endDate.setFullYear(endDate.getFullYear() + 10);

      let events = member.prescriptions
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

      //add holidays

      let h = [];
      holidays.forEach((holiday) => {
        return holiday.dates.forEach((date) => {
          const startDate = dayjs(date);
          const endDate = startDate.add(1, 'day');

          h.push({
            title: holiday.name,
            start: startDate.format('YYYY-MM-DD'),
            end: endDate.format('YYYY-MM-DD'),
            allDay: true,
            color: '#444',
            calendarId: 'cal1',
            holiday: true
          });
        });
      });

      setEvents(h.concat(events));
    }
  }, [member, selectedDrugName]);

  const handleEventMouseEnter = ({ event, jsEvent }) => {
    const { pageX, pageY } = jsEvent; // Use pageX and pageY for positioning

    const content = (
      <Box>
        <Typography sx={{ fontSize: '0.9rem' }}>{event.extendedProps.drug_name}</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>PDC: 89%</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>Prescibing Physician: {event.extendedProps.physician}</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>Claim Number: {event.extendedProps.claim_number}</Typography>
      </Box>
    );

    const contentHeight = content.props.children.length * 20;

    setTooltip({
      display: 'block',
      top: pageY - contentHeight, // Offset from cursor
      bottom: pageY + 65, // Offset from cursor
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
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                pointerEvents: 'none'
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
