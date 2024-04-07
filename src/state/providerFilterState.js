import { number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const providertFilterState = atom({
  key: 'providertFilterState',
  default: null,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
});
