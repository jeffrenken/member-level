//import { Page, expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('Map test page', () => {
  test('should have title and elements', async ({ mapPage }) => {
    await test.step('Step 1: Visit page', () => mapPage.goToPage());
  });
});
