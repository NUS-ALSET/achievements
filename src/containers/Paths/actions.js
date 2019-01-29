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

export const PATH_ACTIVITY_DIALOG_SHOW = "PATH_ACTIVITY_DIALOG_SHOW";
export const pathActivityDialogShow = activityInfo => ({
  type: PATH_ACTIVITY_DIALOG_SHOW,
  activityInfo
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

export const PATH_ACTIVITY_CHANGE_REQUEST = "PATH_ACTIVITY_CHANGE_REQUEST";
export const pathActivityChangeRequest = (pathId, activityInfo) => ({
  type: PATH_ACTIVITY_CHANGE_REQUEST,
  pathId,
  activityInfo
});

export const PATH_ACTIVITY_CHANGE_SUCCESS = "PATH_ACTIVITY_CHANGE_SUCCESS";
export const pathProblemChangeSuccess = (pathId, activityInfo, problemKey) => ({
  type: PATH_ACTIVITY_CHANGE_SUCCESS,
  pathId,
  activityInfo,
  problemKey
});

export const PATH_ACTIVITY_CHANGE_FAIL = "PATH_ACTIVITY_CHANGE_FAIL";
export const pathActivityChangeFail = (pathId, activityInfo, reason) => ({
  type: PATH_ACTIVITY_CHANGE_FAIL,
  pathId,
  activityInfo,
  reason
});

export const PATH_ACTIVITY_DELETE_REQUEST = "PATH_ACTIVITY_DELETE_REQUEST";
export const pathActivityDeleteRequest = (activityId, pathId) => ({
  type: PATH_ACTIVITY_DELETE_REQUEST,
  activityId,
  pathId
});

export const PATH_ACTIVITY_DELETE_SUCCESS = "PATH_ACTIVITY_DELETE_SUCCESS";
export const pathActivityDeleteSuccess = activityId => ({
  type: PATH_ACTIVITY_DELETE_SUCCESS,
  activityId
});

export const PATH_ACTIVITY_DELETE_FAIL = "PATH_ACTIVITY_DELETE_FAIL";
export const pathActivityDeleteFail = (activityId, reason) => ({
  type: PATH_ACTIVITY_DELETE_FAIL,
  activityId,
  reason
});

export const PATH_TAB_SWITCH = "PATH_TAB_SWITCH"
export const switchPathTab = tabIndex => ({
  type: PATH_TAB_SWITCH,
  tabIndex
})