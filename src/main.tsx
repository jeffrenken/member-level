import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/scss/style.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import * as Sentry from '@sentry/react';

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_KEY);

Sentry.init({
  dsn: 'https://284938eecbee6bb6effc504c73a64598@o4507753504636928.ingest.us.sentry.io/4507753506144256',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  //tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  tracePropagationTargets: ['https://feature-updated-member-page.dkgkkbtmxxacd.amplifyapp.com/', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

//import './index.css';
//import config from "./config";

// Import your publishable key
/* const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
} */

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
