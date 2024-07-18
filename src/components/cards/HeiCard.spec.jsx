import { test, expect } from '@playwright/experimental-ct-react';
import HeiCard from './HeiCard';

const title = 'cardTitle';
const content = 'cardContent';
const isLoading = false;
const color = '#fff';
const size = 'md';

test('props', async ({ mount }) => {
  const component = await mount(<HeiCard title={title} content={content} isLoading={isLoading} color={color} size={size} />);
  await expect(component).toContainText(title);
  await expect(component).toContainText(content);
});
