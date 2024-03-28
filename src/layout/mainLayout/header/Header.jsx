import PropTypes from 'prop-types';
import { Box, IconButton, Stack, Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from '@/context/ThemeContextProvider';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { IconMenu2, IconMoon, IconSun } from '@tabler/icons-react';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const { switchColorMode } = useContext(ThemeContext);
  const location = useLocation();

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <>
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              width: 228,
              //display: 'flex',
              [theme.breakpoints.down('md')]: {
                width: 'auto'
              }
            }}
          >
            <IconButton onClick={handleLeftDrawerToggle}>
              <IconMenu2 />
            </IconButton>
            <Box component="span" sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 1 }}>
              LOGO
            </Box>
            {/*       <SearchSection />
             */}{' '}
          </Stack>

          <Box component="span" sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 1 }}>
            {/*  <MuiLink
              component={Link}
              color={location.pathname === '/page1' ? 'primary.main' : 'grey.700'}
              to="/page1"
              underline="none"
              sx={{ fontSize: '1.25rem' }}
            >
              Page 1
            </MuiLink>
          </Box>
          <Box component="span" sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 1 }}>
            <MuiLink
              component={Link}
              color={location.pathname === '/page2' ? 'primary' : 'grey.700'}
              to="/page2"
              underline="none"
              sx={{ fontSize: '1.25rem' }}
            >
              Page 2
            </MuiLink> */}
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={switchColorMode}>{isDarkMode ? <IconSun /> : <IconMoon />}</IconButton>
          {/* <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">Sign In</Link>
          </SignedOut> */}
        </Stack>
        {/*       <NotificationSection />
         */}{' '}
        {/*  <ProfileSection /> */}
      </Stack>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;

{
  /* <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          ></Avatar> */
}
