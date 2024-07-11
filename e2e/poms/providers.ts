// e2e/poms/login.ts

import { Page, expect } from '@playwright/test';

export default class ProvidersPage {
  constructor(private page: Page) {}

  goToPage = async () => {
    await this.page.goto('/provider-groups');
  };
  verifyTitle = async () => {
    await expect(this.page.getByRole('heading', { name: 'Providers', exact: true })).toBeVisible();
  };
}
