//import { Page, expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('Care Managers test page', () => {
  test('should have title and elements', async ({ careManagersPage }) => {
    await test.step('Step 1: Visit page', () => careManagersPage.goToPage());
    await test.step('Step 2: Verify title', () => careManagersPage.verifyTitle());
  });
});
