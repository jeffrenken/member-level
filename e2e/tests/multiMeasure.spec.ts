//import { Page, expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('Multi Measure test page', () => {
  test('should have title and elements', async ({ multiMeasurePage }) => {
    await test.step('Step 1: Visit page', () => multiMeasurePage.goToPage());
    await test.step('Step 2: Verify title', () => multiMeasurePage.verifyTitle());
  });
});
