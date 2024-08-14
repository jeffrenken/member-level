import logoDark from '@/assets/images/logoDark.png';
import logoWhite from '@/assets/images/logoWhite.png';
import { ThemeContext } from '@/context/ThemeContextProvider';
import { Box, Fade, IconButton, List, Stack, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconMoon, IconSun, IconUserCircle, IconInbox } from '@tabler/icons-react';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { items } from './sidebar-items';
import { SidebarItem } from './SidebarItem';
import NotificationList from '../../../NotificationList';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: '0px'
}));

const SidebarIcon = ({ IconComponent }) => {
  return <IconComponent style={{ strokeWidth: 1 }} />;
};

const SidebarItems = ({ drawerToggle }) => {
  const theme = useTheme();
  const { switchColorMode } = useContext(ThemeContext);
  const isDarkMode = theme.palette.mode === 'dark';
  const location = useLocation();

  return (
    <>
      <Box>
        <Box
          component="img"
          alt="logo"
          src={isDarkMode ? logoWhite : logoDark}
          height={30}
          mt={2}
          mb={2}
          ml="6px"
          sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 1, objectFit: 'contain' }}
        />
        <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ width: '100%', mb: 'calc((30vh) / 2)' }}>
          <StyledIconButton color="neutral" onClick={switchColorMode}>
            {isDarkMode ? <SidebarIcon IconComponent={IconSun} /> : <SidebarIcon IconComponent={IconMoon} />}
          </StyledIconButton>
          <StyledIconButton color="neutral">
            <SidebarIcon IconComponent={IconUserCircle} />
          </StyledIconButton>
          <NotificationList />
        </Stack>
        <List>
          {items.map((item, i) => {
            const fadeInTime = 700 * (i + 1);
            return (
              <Fade in={true} appear timeout={fadeInTime} key={item.id}>
                <Box sx={{ borderRight: location.pathname === item.url ? `2px solid ${theme.palette.primary.main}` : 'none' }}>
                  <SidebarItem key={item.id} item={item} level={1} drawerToggle={drawerToggle} />
                </Box>
              </Fade>
            );
          })}
        </List>
      </Box>
    </>
  );
};

export default SidebarItems;
