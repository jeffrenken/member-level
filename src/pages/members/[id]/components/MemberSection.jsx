import { Box, Typography } from '@/components/ui';
import { textAlign } from '@mui/system';
import { Link } from 'react-router-dom';

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
      </Box>
    </div>
  );
}
