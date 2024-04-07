import { router } from '@/routes/router';
import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
//import './App.css';
import { SnackbarProvider } from 'notistack';

// dashboard routing
//const DashboardDefault = Loadable(lazy(() => import('./pages/dashboard/Default/index.jsx')));
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// defaultTheme
//import theme from './themes';
import { ThemeContextProvider } from './context/ThemeContextProvider';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSON } from 'recoil-sync';
//import NavigationScroll from './layout/NavigationScroll.jsx';
const queryClient = new QueryClient();

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
