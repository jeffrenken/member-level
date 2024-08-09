import { Box, Typography } from '@/components/ui';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

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

const fakeDate = () => {
  let date = getRandomDateInLastTwoYears();
  let isRecent = isDateInLast365Days(date);

  return (
    <Typography variant="subtitle2">
      Last AWV: <span style={{ color: isRecent ? '#15cab6' : '#ff0000' }}>{dayjs(date).format('YYYY-MM-DD')}</span>
    </Typography>
  );
};

export function MemberSection({ member }) {
  return (
    <div>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" mb={1} align="center" sx={{ fontSize: '1.5rem' }}>
          {member.firstName} {member.lastName}
        </Typography>
        <Typography variant="body2">{member.address}</Typography>
        <Typography variant="body2">
          {member.city}, {member.state}
        </Typography>
      </Box>
      <Box>
        <Typography mt={2} variant="subtitle2">
          Date of Birth: {member.dateOfBirth}
        </Typography>
        <Typography variant="subtitle2">
          Primary Care Physician:{' '}
          <Link to={`/providers/${member?.providerGroup?.Provider}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
            {member?.providerGroup?.Provider}
          </Link>
        </Typography>
        <Typography variant="subtitle2">Provider Group: {member?.providerGroup?.['Provider Group']}</Typography>
        <Typography variant="subtitle2">Care Supervisor: {member?.supervisor}</Typography>
        <Typography variant="subtitle2">
          Care Manager:{' '}
          <Link to={`/care-managers/${member?.careManager}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
            {member?.careManager}
          </Link>
        </Typography>
        {fakeDate()}
      </Box>
    </div>
  );
}
