import { number, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const contractFilterState = atom({
  key: 'contractFilterState',
  default: 1,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
});
