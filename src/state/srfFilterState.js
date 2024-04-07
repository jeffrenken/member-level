import { number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const srfFilterState = atom({
  key: 'srfFilterState',
  default: null,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
});
