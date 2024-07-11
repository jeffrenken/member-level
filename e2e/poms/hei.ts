// e2e/poms/login.ts

import { Page, expect } from '@playwright/test';

export default class HeiPage {
  constructor(private page: Page) {}

  goToPage = async () => {
    await this.page.goto('/hei');
  };

  verifyTitle = async () => {
    await expect(this.page.getByRole('heading', { name: 'Health Equity Index', exact: true })).toBeVisible();
  };
}
