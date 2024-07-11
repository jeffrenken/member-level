//import { Page, expect } from '@playwright/test';
import { test } from '../fixtures';

test.describe('Measure test page', () => {
  test('should have title and elements', async ({ measuresPage }) => {
    await test.step('Step 1: Visit measures page', () => measuresPage.goToPage());
    await test.step('Step 2: Verify navbar', () => measuresPage.verifyTitle());
    await test.step('Step 3: Verify filters', () => measuresPage.verifyFilters());
    await test.step('Step 4: Verify on track', () => measuresPage.verifyOnTrack());
  });

  test('should have all measure chart cards', async ({ measuresPage }) => {
    await test.step('Visit measures page', () => measuresPage.goToPage());
    await test.step('Verify measure chart cards', () => measuresPage.verifyMeasureChartCards());
  });
});
