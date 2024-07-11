// e2e/poms/login.ts

import { Page, expect } from '@playwright/test';

export default class CareManagersPage {
  constructor(private page: Page) {}

  goToPage = async () => {
    await this.page.goto('/care-managers');
  };
  verifyTitle = async () => {
    await expect(this.page.getByRole('heading', { name: 'Care Managers', exact: true })).toBeVisible();
  };
}
