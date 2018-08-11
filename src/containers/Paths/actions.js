export const PATHS_OPEN = "PATHS_OPEN";
export const pathsOpen = () => ({
  type: PATHS_OPEN
});

export const PATH_GAPI_AUTHORIZED = "PATH_GAPI_AUTHORIZED";
export const pathGAPIAuthorized = status => ({
  type: PATH_GAPI_AUTHORIZED,
  status
});

export const PATH_DIALOG_SHOW = "PATH_DIALOG_SHOW";
export const pathDialogShow = pathInfo => ({
  type: PATH_DIALOG_SHOW,
  pathInfo
});

export const PATH_PROBLEM_DIALOG_SHOW = "PATH_PROBLEM_DIALOG_SHOW";
export const pathProblemDialogShow = problemInfo => ({
  type: PATH_PROBLEM_DIALOG_SHOW,
  problemInfo
});

export const PATHS_JOINED_FETCH_SUCCESS = "PATHS_JOINED_FETCH_SUCCESS";
export const pathsJoinedFetchSuccess = paths => ({
  type: PATHS_JOINED_FETCH_SUCCESS,
  paths
});

export const PATH_DIALOG_HIDE = "PATH_DIALOG_HIDE";
export const pathDialogHide = () => ({
  type: PATH_DIALOG_HIDE
});

export const PATH_CHANGE_REQUEST = "PATH_CHANGE_REQUEST";
export const pathChangeRequest = pathInfo => ({
  type: PATH_CHANGE_REQUEST,
  pathInfo
});

export const PATH_CHANGE_SUCCESS = "PATH_CHANGE_SUCCESS";
export const pathChangeSuccess = (pathInfo, pathKey) => ({
  type: PATH_CHANGE_SUCCESS,
  pathInfo,
  pathKey
});

export const PATH_SELECT = "PATH_SELECT";
export const pathSelect = pathId => ({
  type: PATH_SELECT,
  pathId
});

export const PATH_ACTIVITY_MOVE_REQUEST = "PATH_ACTIVITY_MOVE_REQUEST";
export const pathActivityMoveRequest = (pathId, activityId, direction) => ({
  type: PATH_ACTIVITY_MOVE_REQUEST,
  pathId,
  activityId,
  direction
});

export const PATH_ACTIVITY_MOVE_SUCCESS = "PATH_ACTIVITY_MOVE_SUCCESS";
export const pathActivityMoveSuccess = (pathId, activityId, direction) => ({
  type: PATH_ACTIVITY_MOVE_SUCCESS,
  pathId,
  activityId,
  direction
});

export const PATH_ACTIVITY_MOVE_FAIL = "PATH_ACTIVITY_MOVE_FAIL";
export const pathActivityMoveFail = (
  pathId,
  activityId,
  direction,
  reason
) => ({
  type: PATH_ACTIVITY_MOVE_FAIL,
  pathId,
  activityId,
  direction,
  reason
});

export const PATH_PROBLEM_CHANGE_REQUEST = "PATH_PROBLEM_CHANGE_REQUEST";
export const pathProblemChangeRequest = (pathId, problemInfo) => ({
  type: PATH_PROBLEM_CHANGE_REQUEST,
  pathId,
  problemInfo
});

export const PATH_PROBLEM_CHANGE_SUCCESS = "PATH_PROBLEM_CHANGE_SUCCESS";
export const pathProblemChangeSuccess = (pathId, problemInfo, problemKey) => ({
  type: PATH_PROBLEM_CHANGE_SUCCESS,
  pathId,
  problemInfo,
  problemKey
});

export const PATH_PROBLEM_CHANGE_FAIL = "PATH_PROBLEM_CHANGE_FAIL";
export const pathProblemChangeFail = (pathId, problemInfo, reason) => ({
  type: PATH_PROBLEM_CHANGE_FAIL,
  pathId,
  problemInfo,
  reason
});
