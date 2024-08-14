import MainLayout from '@/components/layouts/mainLayout/MainLayout';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import { authRoutes } from './routes';
import { ErrorFallback } from '../components/ErrorFallback';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorFallback />,
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: authRoutes.map((route) => ({
      path: route.path,
      lazy: route.lazy
      //loader: route?.loader
    }))
  }
]);
