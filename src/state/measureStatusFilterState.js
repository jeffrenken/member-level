import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const measureStatusFilterState = atom({
  key: 'measureStatusFilterState',
  default: 'stars',
  effects: [urlSyncEffect({ refine: string(), history: 'push' })]
});
