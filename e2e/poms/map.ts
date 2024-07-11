// e2e/poms/login.ts

import { Page } from '@playwright/test';

export default class MapPage {
  constructor(private page: Page) {}

  goToPage = async () => {
    await this.page.goto('/map');
  };
}
