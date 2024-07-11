import { Page, expect } from '@playwright/test';

export class Navbar {
  constructor(private page: Page) {}

  verifyNavbar = async () => {
    await expect(this.page.getByTestId('navbar')).toBeVisible();
  };
}
