//import { Page, expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('Members test page', () => {
  test('should have title and elements', async ({ membersPage }) => {
    await test.step('Step 1: Visit page', () => membersPage.goToPage());
    await test.step('Step 2: Verify title', () => membersPage.verifyTitle());
  });
});
