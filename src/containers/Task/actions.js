export const TASK_OPEN = "TASK_OPEN";
export const taskOpen = taskId => ({
  type: TASK_OPEN,
  taskId
});

export const TASK_PRESETS_LOAD_SUCCESS = "TASK_PRESETS_LOAD_SUCCESS";
export const taskPresetsLoadSuccess = presets => ({
  type: TASK_PRESETS_LOAD_SUCCESS,
  presets
});

export const TASK_LOAD_SUCCESS = "TASK_LOAD_SUCCESS";
export const taskLoadSuccess = (taskId, taskInfo) => ({
  type: TASK_LOAD_SUCCESS,
  taskId,
  taskInfo
});

export const TASK_SAVE_REQUEST = "TASK_SAVE_REQUEST";
export const taskSaveRequest = (taskId, taskInfo) => ({
  type: TASK_SAVE_REQUEST,
  taskId,
  taskInfo
});

export const TASK_SAVE_SUCCESS = "TASK_SAVE_SUCCESS";
export const taskSaveSuccess = taskId => ({
  type: TASK_SAVE_SUCCESS,
  taskId
});

export const TASK_SAVE_FAIL = "TASK_SAVE_FAIL";
export const taskSaveFail = (taskId, reason) => ({
  type: TASK_SAVE_FAIL,
  taskId,
  reason
});
