import { Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layout/mainLayout/MainLayout';
import Dashboard from '@/pages/dashboard/Dashboard';
import SignInPage from '@/pages/sign-in/SignInPage';
import { AuthGuard } from './AuthGuard';
import BobPage from '@/pages/BobPage';
import Page2 from '@/pages/Page2';
import Test from '@/pages/test/Test';
import Measure from '@/pages/measures/[id]/Measure';
import Map from '@/pages/map/Map';
import County from '@/pages/states/[id]/counties/[id]/County';
import Member from '@/pages/members/[id]/Member';
import SocialRiskFactors from '@/pages/social-risk-factors/SocialRiskFactors';
import Table from '@/pages/table/Table';
import MembersPage from '@/pages/members/MembersPage';
import ProviderPage from '@/pages/providers/[name]/ProviderPage';
import MeasuresPage from '@/pages/measures/MeasuresPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <MeasuresPage />
      },
      {
        path: '/map',
        element: <Map />
      },
      {
        path: '/measures/:id',
        element: <Measure />
      },
      {
        path: '/measures',
        element: <Measure />
      },
      {
        path: '/members',
        element: <MembersPage />
      },
      {
        path: '/members/:id',
        element: <Member />
      },
      {
        path: '/providers/:name',
        element: <ProviderPage />
      },
      {
        path: '/states/:abbreviation/counties/:countyName',
        element: <County />
      },
      {
        path: '/social-risk-factors',
        element: <SocialRiskFactors />
      },
      {
        path: '/table',
        element: <Table />
      },
      {
        path: '/test',
        element: <Test />
      },
      {
        path: '/page1',
        element: <BobPage />
      },
      {
        path: '/page2',
        element: <Page2 />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/bob',
        element: <BobPage />
      }
    ]
  },
  {
    path: '/sign-in',
    element: <SignInPage />
  }
]);
