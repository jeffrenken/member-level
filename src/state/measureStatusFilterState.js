import { number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const measureStatusFilterState = atom({
  key: 'measureStatusFilterState',
  default: 1,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
});
