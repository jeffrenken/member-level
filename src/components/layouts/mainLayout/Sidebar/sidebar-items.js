import { IconChartBar, IconClipboardPlus, IconLayoutGrid, IconMap, IconTable, IconTableHeart, IconUserHeart } from '@tabler/icons-react';

export const items = [
  {
    id: 'measures',
    title: 'Measures',
    url: '/',
    icon: IconLayoutGrid
  },
  {
    id: 'multi-measure',
    title: 'Multi-Measure',
    url: '/multi-measure',
    icon: IconChartBar
  },
  {
    id: 'HEI',
    title: 'HEI',
    url: '/hei',
    icon: IconUserHeart
  },
  {
    id: 'map',
    title: 'Map',
    url: '/map',
    icon: IconMap
  },
  {
    id: 'memberTable',
    title: 'Members',
    url: '/members',
    icon: IconTableHeart
  },
  {
    id: 'providerGroupsTable',
    title: 'Providers',
    url: '/provider-groups',
    icon: IconTable
  },
  {
    id: 'careManagers',
    title: 'Care Managers',
    url: '/care-managers',
    icon: IconClipboardPlus
  }
];
