//import { Page, expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('HEI test page', () => {
  test('should have title and elements', async ({ heiPage }) => {
    await test.step('Step 1: Visit page', () => heiPage.goToPage());
    await test.step('Step 2: Verify title', () => heiPage.verifyTitle());
  });
});
