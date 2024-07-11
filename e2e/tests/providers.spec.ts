//import { Page, expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('Providers test page', () => {
  test('should have title and elements', async ({ providersPage }) => {
    await test.step('Step 1: Visit page', () => providersPage.goToPage());
    await test.step('Step 2: Verify title', () => providersPage.verifyTitle());
  });
});
