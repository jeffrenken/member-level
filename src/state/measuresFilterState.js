import { array, number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const measuresFilterState = atom({
  key: 'measuresFilterState',
  default: [],
  effects: [urlSyncEffect({ refine: array(number()), history: 'push' })]
});
