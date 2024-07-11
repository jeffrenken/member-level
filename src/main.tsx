import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/scss/style.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_KEY);

//import './index.css';
//import config from "./config";

// Import your publishable key
/* const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
} */

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
