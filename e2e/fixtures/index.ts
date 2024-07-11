// fixtures/index.ts

import { test as base } from '@playwright/test';
import LoginPage from '../poms/login';
import { TaskPage } from '../poms/tasks';
import MeasuresPage from '../poms/measures';
import MultiMeasurePage from '../poms/multiMeasure';
import HeiPage from '../poms/hei';
import MapPage from '../poms/map';
import MembersPage from '../poms/members';
import ProvidersPage from '../poms/providers';
import CareManagersPage from '../poms/careManagers';

interface ExtendedFixtures {
  loginPage: LoginPage;
  taskPage: TaskPage;
  measuresPage: MeasuresPage;
  multiMeasurePage: MultiMeasurePage;
  heiPage: HeiPage;
  mapPage: MapPage;
  membersPage: MembersPage;
  providersPage: ProvidersPage;
  careManagersPage: CareManagersPage;
}

export const test = base.extend<ExtendedFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  taskPage: async ({ page }, use) => {
    const taskPage = new TaskPage(page);
    await use(taskPage);
  },
  measuresPage: async ({ page }, use) => {
    const measuresPage = new MeasuresPage(page);
    await use(measuresPage);
  },
  multiMeasurePage: async ({ page }, use) => {
    const multiMeasurePage = new MultiMeasurePage(page);
    await use(multiMeasurePage);
  },
  heiPage: async ({ page }, use) => {
    const heiPage = new HeiPage(page);
    await use(heiPage);
  },
  mapPage: async ({ page }, use) => {
    const mapPage = new MapPage(page);
    await use(mapPage);
  },
  membersPage: async ({ page }, use) => {
    const membersPage = new MembersPage(page);
    await use(membersPage);
  },
  providersPage: async ({ page }, use) => {
    const providersPage = new ProvidersPage(page);
    await use(providersPage);
  },
  careManagersPage: async ({ page }, use) => {
    const careManagersPage = new CareManagersPage(page);
    await use(careManagersPage);
  }
});
