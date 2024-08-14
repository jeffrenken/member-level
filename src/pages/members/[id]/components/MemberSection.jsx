import { Box, Typography } from '@/components/ui';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export function MemberSection({ member }) {
  const fakeDate = useMemo(() => {
    function getRandomDateInLastTwoYears() {
      // Get the current date
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00

      // Calculate the timestamp for the date exactly two years ago
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);
      twoYearsAgo.setHours(0, 0, 0, 0); // Reset the time to 00:00:00

      // Generate a random timestamp between two years ago and now
      const randomTimestamp = Math.random() * (currentDate.getTime() - twoYearsAgo.getTime()) + twoYearsAgo.getTime();

      // Convert the timestamp back into a date object
      const randomDate = new Date(randomTimestamp);
      randomDate.setHours(0, 0, 0, 0); // Ensure the time is 00:00:00

      return randomDate;
    }
    function isDateInLast365Days(date) {
      // Get the current date
      const currentDate = new Date();

      // Calculate the date 365 days ago
      const pastDate = new Date();
      pastDate.setDate(currentDate.getDate() - 365);

      // Check if the given date is within the last 365 days
      return date >= pastDate && date <= currentDate;
    }

    let date = getRandomDateInLastTwoYears();
    let isRecent = isDateInLast365Days(date);

    return (
      <Typography sx={{ fontSize: '1rem' }}>
        Last AWV: <span style={{ color: isRecent ? '#15cab6' : '#ff0000' }}>{dayjs(date).format('YYYY-MM-DD')}</span>
      </Typography>
    );
  }, []);

  return (
    <div>
      <Box>
        <Typography mb={1} sx={{ fontSize: '1.75rem' }}>
          {member.firstName} {member.lastName}
        </Typography>
        <Typography sx={{ fontSize: '1rem' }}>{member.address}</Typography>
        <Typography sx={{ fontSize: '1rem' }}>
          {member.city}, {member.state}
        </Typography>
      </Box>
      <Box>
        <Typography mt={2} sx={{ fontSize: '1rem' }}>
          Date of Birth: {member.dateOfBirth}
        </Typography>
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
        {fakeDate}
      </Box>
    </div>
  );
}
