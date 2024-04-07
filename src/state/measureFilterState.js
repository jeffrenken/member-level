import { number, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const measureFilterState = atom({
  key: 'measureFilterState',
  default: null,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
});
