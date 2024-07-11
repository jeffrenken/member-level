// e2e/poms/login.ts

import { Page, expect } from '@playwright/test';

export default class MultiMeasurePage {
  constructor(private page: Page) {}

  goToPage = async () => {
    await this.page.goto('/multi-measure');
  };

  verifyTitle = async () => {
    await expect(this.page.getByRole('heading', { name: 'Multi-Measure', exact: true })).toBeVisible();
  };
}
