import { test, expect } from '@playwright/experimental-ct-react';
import Sidebar from './Sidebar';
import { items } from './sidebar-items';

test('links', async ({ mount }) => {
  const component = await mount(<Sidebar />);
  await expect(component).toContainText(items[0].title);
});
