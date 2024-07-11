import { Page, expect } from '@playwright/test';
import { CREATE_TASK_SELECTORS, NAVBAR_SELECTORS, TASKS_TABLE_SELECTORS } from '../constants/selectors';

interface TaskName {
  taskName: string;
}

interface CreateNewTaskProps extends TaskName {
  userName?: string;
}

export class TaskPage {
  constructor(private page: Page) {}

  createTaskAndVerify = async ({ taskName, userName = 'Oliver Smith' }: CreateNewTaskProps) => {
    //await this.page.getByTestId(NAVBAR_SELECTORS.addTodoButton).click();
    await this.page.getByTestId(CREATE_TASK_SELECTORS.taskTitleField).fill(taskName);

    await this.page.locator(CREATE_TASK_SELECTORS.memberSelectContainer).click();
    await this.page.locator(CREATE_TASK_SELECTORS.memberOptionField).getByText(userName).click();
    await this.page.getByTestId(CREATE_TASK_SELECTORS.createTaskButton).click();
    const taskInDashboard = this.page.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable).getByRole('row', {
      name: new RegExp(taskName, 'i')
    });
    await taskInDashboard.scrollIntoViewIfNeeded();
    await expect(taskInDashboard).toBeVisible();
  };

  markTaskAsCompletedAndVerify = async ({ taskName }: TaskName) => {
    await expect(this.page.getByRole('heading', { name: 'Loading...' })).toBeHidden();

    const completedTaskInDashboard = this.page.getByTestId(TASKS_TABLE_SELECTORS.completedTasksTable).getByRole('row', { name: taskName });

    const isTaskCompleted = await completedTaskInDashboard.count();

    if (isTaskCompleted) return;

    await this.page.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable).getByRole('row', { name: taskName }).getByRole('checkbox').click();
    await completedTaskInDashboard.scrollIntoViewIfNeeded();
    await expect(completedTaskInDashboard).toBeVisible();
  };

  starTaskAndVerify = async ({ taskName }: TaskName) => {
    const starIcon = this.page
      .getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
      .getByRole('row', { name: taskName })
      .getByTestId(TASKS_TABLE_SELECTORS.starUnstarButton);
    await starIcon.click();
    await expect(starIcon).toHaveClass(/ri-star-fill/i);
    await expect(this.page.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable).getByRole('row').nth(1)).toContainText(taskName);
  };
}
