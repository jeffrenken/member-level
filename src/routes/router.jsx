import MainLayout from '@/components/layouts/mainLayout/MainLayout';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import { authRoutes } from './routes';
import { ErrorFallback } from '../components/ErrorFallback';
import { IdleLogout } from '../components/IdleLogout';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorFallback />,
    element: (
      <AuthGuard>
        <IdleLogout>
          <MainLayout />
        </IdleLogout>
      </AuthGuard>
    ),
    children: authRoutes.map((route) => ({
      path: route.path,
      lazy: route.lazy
      //loader: route?.loader
    }))
  }
]);
