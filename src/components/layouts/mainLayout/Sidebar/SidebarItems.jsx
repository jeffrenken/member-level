import logoDark from '@/assets/images/logoDark.png';
import logoWhite from '@/assets/images/logoWhite.png';
import { ThemeContext } from '@/context/ThemeContextProvider';
import { Box, Fade, IconButton, List, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconMoon, IconSun, IconUserCircle } from '@tabler/icons-react';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { items } from './sidebar-items';
import { SidebarItem } from './SidebarItem';

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
        <Stack direction="row" justifyContent="center" sx={{ width: '100%', mb: 'calc((30vh) / 2)' }}>
          <IconButton color="neutral" onClick={switchColorMode}>
            {isDarkMode ? <IconSun /> : <IconMoon />}
          </IconButton>
          <IconButton color="neutral">
            <IconUserCircle style={{ strokeWidth: 1.5 }} />
          </IconButton>
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
