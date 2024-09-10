import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const starsYearFilterState = atom({
  key: 'starsYearFilterState',
  default: import.meta.env.VITE_STARS_YEAR || '2026',
  effects: [urlSyncEffect({ refine: string(), history: 'push' })]
});
