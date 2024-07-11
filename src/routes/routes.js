export const authRoutes = [
  {
    path: '/',
    //element: <MeasuresPage />
    lazy: () => import('@/pages/measures/MeasuresPage')
    //loader: measuresLoader
  },
  {
    path: '/care-managers',
    lazy: () => import('@/pages/careManagers/CareManagersPage')
  },
  {
    path: '/care-managers/:name',
    lazy: () => import('@/pages/careManagers/[name]/CareManagerPage')
  },
  {
    path: '/map',
    lazy: () => import('@/pages/map/Map')
  },
  {
    path: '/map-census',
    lazy: () => import('@/pages/mapCensus/MapCensus')
  },
  {
    path: '/map-zipcodes',
    lazy: () => import('@/pages/mapZipCodes/MapZipCodes')
  },
  {
    path: '/measures/:id',
    lazy: () => import('@/pages/measures/[id]/MeasurePage')
  },
  {
    path: '/measures',
    lazy: () => import('@/pages/measures/[id]/MeasurePage')
  },
  {
    path: '/provider-groups',
    lazy: () => import('@/pages/providerGroups/ProvidersGroupsPage')
  },
  {
    path: '/members',
    lazy: () => import('@/pages/members/MembersPage')
  },
  {
    path: '/multi-measure',
    lazy: () => import('@/pages/multiMeasure/MultiMeasurePage')
  },
  {
    path: '/members/unattributed',
    lazy: () => import('@/pages/members/unattributed/MembersUnattributedPage')
  },
  {
    path: '/members/:id',
    lazy: () => import('@/pages/members/[id]/Member')
  },
  {
    path: '/hei',
    lazy: () => import('@/pages/hei/HeiPage')
  },
  {
    path: '/provider-groups/:id',
    lazy: () => import('@/pages/providers/[name]/ProviderPage')
  },
  {
    path: '/providers/:name', //I know name is bad. All we have now
    lazy: () => import('@/pages/providers/[name]/ProviderPage')
  },
  {
    path: '/states/:abbreviation/counties/:countyName',
    lazy: () => import('@/pages/states/[id]/counties/[id]/County')
  },
  {
    path: '/social-risk-factors',
    lazy: () => import('@/pages/social-risk-factors/SocialRiskFactors')
  },
  {
    path: '/test',
    lazy: () => import('@/pages/TestPage')
  }
];
