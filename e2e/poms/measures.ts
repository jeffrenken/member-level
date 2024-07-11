// e2e/poms/login.ts

import { Page, expect } from '@playwright/test';
import { NAVBAR_SELECTORS, MEASURE_SELECTORS } from '../constants/selectors';

async function testFilter(page: Page, name: string, filter = '') {
  const ulElement = await page.waitForSelector(`#${name}-listbox`, { state: 'visible' });
  expect(ulElement).not.toBeNull();
  const listItems = page.locator(`#${name}-listbox li`);
  const count = await listItems.count();
  expect(count).toBeGreaterThan(1);
  if (filter) {
    await listItems.first().click();
    await page.waitForFunction((filter: string) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.has(filter);
    }, filter);
    const url = new URL(page.url());
    const f = url.searchParams.get(filter);
    expect(f).toBeTruthy();
  }
}

export default class MeasuresPage {
  constructor(private page: Page) {}

  goToPage = async () => {
    await this.page.goto('/');
  };

  verifyTitle = async () => {
    await expect(this.page.getByTestId(NAVBAR_SELECTORS.navbar)).toBeVisible();
  };

  verifyFilters = async () => {
    await expect(this.page.getByRole('button', { name: 'H1111' })).toBeVisible();
    await this.page.getByRole('button', { name: 'H1111' }).click();
    await testFilter(this.page, 'contractMenuList', 'contractFilterState');

    await expect(this.page.getByRole('button', { name: 'Provider Groups' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Provider Groups' }).click();
    await testFilter(this.page, 'providerGroupMenuList', 'providerFilterState');

    await expect(this.page.getByRole('button', { name: 'Members' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Members' }).click();
    await testFilter(this.page, 'srfMenuList', 'srfFilterState');

    await expect(this.page.getByRole('button', { name: 'Stars Measures' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Stars Measures' }).click();
    await testFilter(this.page, 'measureStatusMenuList', 'measureStatusFilterState');
  };

  verifyOnTrack = async () => {
    await this.page.getByTestId('onTrack4Card').click();
    await this.page.getByTestId('onTrack5Card').click();
    await this.page.getByTestId('offTrackCard').click();
  };

  verifyMeasureChartCards = async () => {
    await expect(this.page.getByRole('button', { name: 'Stars Measures' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Stars Measures' }).click();
    await this.page.getByRole('option', { name: 'All Measures' }).click();
    await expect(this.page.getByTestId(MEASURE_SELECTORS.measureChartCard)).toHaveCount(48);
  };
}
