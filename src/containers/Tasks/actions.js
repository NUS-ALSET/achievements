export const TASKS_OPEN = "TASKS_OPEN";
export const tasksOpen = () => ({
  type: TASKS_OPEN
});

export const TASKS_LOAD_SUCCESS = "TASKS_LOAD_SUCCESS";
export const tasksLoadSuccess = tasks => ({
  type: TASKS_LOAD_SUCCESS,
  tasks
});

export const TASKS_LOAD_FAIL = "TASKS_LOAD_FAIL";
export const tasksLoadFail = reason => ({
  type: TASKS_LOAD_FAIL,
  reason
});

export const TASKS_ADD_TASK_DIALOG_SHOW = "TASKS_ADD_TASK_DIALOG_SHOW";
export const tasksAddTaskDialogShow = () => ({
  type: TASKS_ADD_TASK_DIALOG_SHOW
});

export const TASKS_DIALOG_HIDE = "TASKS_DIALOG_HIDE";
export const tasksDialogHide = () => ({
  type: TASKS_DIALOG_HIDE
});

export const TASKS_ADD_TASK_REQUEST = "TASKS_ADD_TASK_REQUEST";
export const tasksAddTaskRequest = taskInfo => ({
  type: TASKS_ADD_TASK_REQUEST,
  taskInfo
});

export const TASKS_ADD_TASK_SUCCESS = "TASKS_ADD_TASK_SUCCESS";
export const tasksAddTaskSuccess = taskInfo => ({
  type: TASKS_ADD_TASK_SUCCESS,
  taskInfo
});

export const TASKS_ADD_TASK_FAIL = "TASKS_ADD_TASK_FAIL";
export const tasksAddTaskFail = (taskInfo, reason) => ({
  type: TASKS_ADD_TASK_FAIL,
  taskInfo,
  reason
});
