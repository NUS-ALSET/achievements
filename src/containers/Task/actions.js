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

export const TASK_RUN_REQUEST = "TASK_RUN_REQUEST";
export const taskRunRequest = (taskId, taskInfo, solution) => ({
  type: TASK_RUN_REQUEST,
  taskId,
  taskInfo,
  solution
});

export const TASK_RUN_SUCCESS = "TASK_RUN_SUCCESS";
export const taskRunSuccess = (taskId, response) => ({
  type: TASK_RUN_SUCCESS,
  taskId,
  response
});

export const TASK_RUN_FAIL = "TASK_RUN_FAIL";
export const taskRunFail = (taskId, reason) => ({
  type: TASK_RUN_FAIL,
  taskId,
  reason
});

export const TASK_EXPORT_REQUEST = "TASK_EXPORT_REQUEST";
export const taskExportRequest = taskId => ({
  type: TASK_EXPORT_REQUEST,
  taskId
});

export const TASK_IMPORT_DIALOG_SHOW = "TASK_IMPORT_DIALOG_SHOW";
export const taskImportDialogShow = dialog => ({
  type: TASK_IMPORT_DIALOG_SHOW,
  dialog
});

export const TASK_IMPORT_DIALOG_HIDE = "TASK_IMPORT_DIALOG_HIDE";
export const taskImportDialogHide = () => ({
  type: TASK_IMPORT_DIALOG_HIDE
});
