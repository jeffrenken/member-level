import { router } from '@/routes/router';
import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
//import './App.css';
import { SnackbarProvider } from 'notistack';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib';

// defaultTheme
//import theme from './themes';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSON } from 'recoil-sync';
import { ThemeContextProvider } from './context/ThemeContextProvider';
//import NavigationScroll from './layout/NavigationScroll.jsx';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <RecoilURLSyncJSON location={{ part: 'queryParams' }}>
          <ThemeContextProvider>
            <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              <CssBaseline />
              <RouterProvider router={router} />
            </SnackbarProvider>
          </ThemeContextProvider>
        </RecoilURLSyncJSON>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default App;
