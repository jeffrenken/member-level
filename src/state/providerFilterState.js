import { number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const providerFilterState = atom({
  key: 'providerFilterState',
  default: null,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
});
