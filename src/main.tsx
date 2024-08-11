import * as Sentry from '@sentry/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import App from './App.tsx';
import './assets/scss/style.scss';

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_KEY);

Sentry.init({
  dsn: 'https://284938eecbee6bb6effc504c73a64598@o4507753504636928.ingest.us.sentry.io/4507753506144256',
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({ useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes }),
    Sentry.replayIntegration()
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  //tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  tracePropagationTargets: ['https://feature-updated-member-page.dkgkkbtmxxacd.amplifyapp.com/', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
