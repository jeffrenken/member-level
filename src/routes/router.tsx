import MainLayout from '@/layout/mainLayout/MainLayout';
import BobPage from '@/pages/BobPage';
import Page2 from '@/pages/Page2';
import Map from '@/pages/map/Map';
import MeasuresPage from '@/pages/measures/MeasuresPage';
import Measure from '@/pages/measures/[id]/Measure';
import MembersPage from '@/pages/members/MembersPage';
import Member from '@/pages/members/[id]/Member';
import ProvidersPage from '@/pages/providerGroups/ProvidersGroupsPage';
import ProviderPage from '@/pages/providers/[name]/ProviderPage';
import SignInPage from '@/pages/sign-in/SignInPage';
import SocialRiskFactors from '@/pages/social-risk-factors/SocialRiskFactors';
import County from '@/pages/states/[id]/counties/[id]/County';
import Table from '@/pages/table/Table';
import Test from '@/pages/test/Test';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';

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
        path: '/provider-groups',
        element: <ProvidersPage />
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
        path: '/provider-groups/:id',
        element: <ProviderPage />
      },
      {
        path: '/providers/:name', //I know name is bad. All we have now
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
