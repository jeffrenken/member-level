import MainLayout from '@/layout/mainLayout/MainLayout';
import BobPage from '@/pages/BobPage';
import Page2 from '@/pages/Page2';
import HeiPage from '@/pages/hei/HeiPage';
import Map from '@/pages/map/Map';
import MeasuresPage from '@/pages/measures/MeasuresPage';
import Measure from '@/pages/measures/[id]/MeasurePage';
import MembersFilteredByMeasuresPage from '@/pages/members/MembersFilteredByMeasuresPage';
import MembersPage from '@/pages/members/MembersPage';
import Member from '@/pages/members/[id]/Member';
import ProvidersPage from '@/pages/providerGroups/ProvidersGroupsPage';
import ProviderPage from '@/pages/providers/[name]/ProviderPage';
import SocialRiskFactors from '@/pages/social-risk-factors/SocialRiskFactors';
import County from '@/pages/states/[id]/counties/[id]/County';
import Table from '@/pages/table/Table';
import Test from '@/pages/test/Test';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import MembersUnattributedPage from '@/pages/members/unattributed/MembersUnattributedPage';
import { CarePage } from '@/pages/care';
import CareManagerPage from '@/pages/care-managers/[name]/CareManagerPage';
import MapCensus from '@/pages/mapCensus/MapCensus';
import MapZipCodes from '@/pages/mapZipCodes/MapZipCodes';

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
        path: '/care',
        element: <CarePage />
      },
      {
        path: '/care-managers/:name',
        element: <CareManagerPage />
      },
      {
        path: '/map',
        element: <Map />
      },
      {
        path: '/map-census',
        element: <MapCensus />
      },
      {
        path: '/map-zipcodes',
        element: <MapZipCodes />
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
        path: '/members/filters/measures',
        element: <MembersFilteredByMeasuresPage />
      },
      {
        path: '/members/unattributed',
        element: <MembersUnattributedPage />
      },
      {
        path: '/members/:id',
        element: <Member />
      },
      {
        path: '/hei',
        element: <HeiPage />
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
  }
]);
