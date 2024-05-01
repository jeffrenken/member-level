import ContractsAutocomplete from '@/components/inputs/ContractsAutocomplete';
import PlanAutocomplete from '@/components/inputs/PlanAutocomplete';
import RatingAutocomplete from '@/components/inputs/RatingAutocomplete';
import StatesAutocomplete from '@/components/inputs/StatesAutocomplete';
import YearAutocomplete from '@/components/inputs/YearAutocomplete';
import {
  IconDashboard,
  IconExclamationCircle,
  IconLayoutGrid,
  IconMap,
  IconPerfume,
  IconRainbow,
  IconTable,
  IconUserHeart
} from '@tabler/icons-react';

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
        icon: IconLayoutGrid,
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
        icon: IconTable,
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
