// e2e/constants/selectors/index.ts

import { CREATE_TASK_SELECTORS } from './createTask';
import { TASKS_TABLE_SELECTORS } from './dashboard';
import { LOGIN_SELECTORS } from './login';

const NAVBAR_SELECTORS = {
  navbar: 'navbar',
  searchDialog: 'searchDialog'
};

const MEASURE_SELECTORS = {
  measureChartCard: 'measureChartCard',
  measureChartCardQuotient: 'measureChartCardQuotient',
  measureChartCardNum: 'measureChartCardNum',
  measureChartCardDen: 'measureChartCardDen'
};

export { NAVBAR_SELECTORS, LOGIN_SELECTORS, CREATE_TASK_SELECTORS, TASKS_TABLE_SELECTORS, MEASURE_SELECTORS };
