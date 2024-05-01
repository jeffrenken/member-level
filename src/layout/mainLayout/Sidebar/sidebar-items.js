import { IconChartBar, IconLayoutGrid, IconMap, IconTable, IconTableHeart, IconUserHeart } from '@tabler/icons-react';

export const items = [
  {
    id: 'utilities',
    title: '',
    type: 'group',
    children: [
      /*  {
        id: 'contracts',
        type: 'component',
        component: ContractsAutocomplete
      },
      {
        id: 'year',
        type: 'component',
        component: YearAutocomplete
      },
      {
        id: 'plan',
        type: 'component',
        component: PlanAutocomplete
      },
      {
        id: 'rating',
        type: 'component',
        component: RatingAutocomplete
      } */

      {
        id: 'measures',
        title: 'Measures',
        type: 'item',
        url: '/',
        icon: IconLayoutGrid,
        breadcrumbs: false
      },
      {
        id: 'members/filters/measures',
        title: 'Multi-Measure',
        type: 'item',
        url: '/members/filters/measures',
        icon: IconChartBar,
        breadcrumbs: false
      },
      {
        id: 'HEI',
        title: 'HEI',
        type: 'item',
        url: '/hei',
        icon: IconUserHeart,
        breadcrumbs: false
      },
      {
        id: 'map',
        title: 'Map',
        type: 'item',
        url: '/map',
        icon: IconMap,
        breadcrumbs: false
      },
      /*  {
        id: 'social',
        title: 'Social Risk Factors',
        type: 'item',
        url: '/social-risk-factors',
        icon: IconExclamationCircle,
        breadcrumbs: false
      }, */
      {
        id: 'memberTable',
        title: 'Members',
        type: 'item',
        url: '/members',
        icon: IconTableHeart,
        breadcrumbs: false
      },
      {
        id: 'providerGroupsTable',
        title: 'Providers',
        type: 'item',
        url: '/provider-groups',
        icon: IconTable,
        breadcrumbs: false
      }
      /* {
        id: 'table',
        title: 'Sample',
        type: 'item',
        url: '/table',
        icon: IconTable,
        breadcrumbs: false
      }, */

      /*       {
        id: 'icons',
        title: 'Dropdown',
        type: 'collapse',
        icon: IconPerfume,
        children: [
          {
            id: 'tabler-icons',
            title: 'Tabler Icons',
            type: 'item',
            url: '#',
            breadcrumbs: false
          },
          {
            id: 'material-icons',
            title: 'Material Icons',
            type: 'item',
            external: true,
            target: '_blank',
            url: 'https://mui.com/material-ui/material-icons/',
            breadcrumbs: false
          }
        ]
      } */
    ]
  }
];
