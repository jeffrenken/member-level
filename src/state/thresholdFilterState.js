import { number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const thresholdFilterState = atom({
  key: 'thresholdFilterState',
  default: 0,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
});
