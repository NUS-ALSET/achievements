export const TASKS_DELETE_TASK_DIALOG_SHOW = "TASKS_DELETE_TASK_DIALOG_SHOW";
export const tasksDeleteTaskDialogShow = taskId => ({
  type: TASKS_DELETE_TASK_DIALOG_SHOW,
  taskId
});

export const TASKS_DIALOG_HIDE = "TASKS_DIALOG_HIDE";
export const tasksDialogHide = () => ({
  type: TASKS_DIALOG_HIDE
});

export const TASKS_DELETE_TASK_REQUEST = "TASKS_DELETE_TASK_REQUEST";
export const tasksDeleteTaskRequest = taskId => ({
  type: TASKS_DELETE_TASK_REQUEST,
  taskId
});

export const TASKS_DELETE_TASK_SUCCESS = "TASKS_DELETE_TASK_SUCCESS";
export const tasksDeleteTaskSuccess = taskId => ({
  type: TASKS_DELETE_TASK_SUCCESS,
  taskId
});

export const TASKS_DELETE_TASK_FAIL = "TASKS_DELETE_TASK_FAIL";
export const tasksDeleteTaskFail = (taskId, reason) => ({
  type: TASKS_DELETE_TASK_FAIL,
  taskId,
  reason
});
