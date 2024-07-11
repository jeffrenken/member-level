// e2e/poms/login.ts

import { Page, expect } from '@playwright/test';

export default class MembersPage {
  constructor(private page: Page) {}

  goToPage = async () => {
    await this.page.goto('/members');
  };
  verifyTitle = async () => {
    await expect(this.page.getByRole('heading', { name: 'Members', exact: true })).toBeVisible();
  };
}
