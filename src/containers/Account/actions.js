export const ACCOUNT_OPEN = "ACCOUNT_OPEN";
export const accountOpen = accountId => ({
  type: ACCOUNT_OPEN,
  accountId
});

export const ACCOUNT_FETCH_PATHS = "ACCOUNT_FETCH_PATHS";
export const accountFetchPaths = (accountId, paths) => ({
  type: ACCOUNT_FETCH_PATHS,
  accountId,
  paths
});

export const EXTERNAL_PROFILE_DIALOG_SHOW = "EXTERNAL_PROFILE_DIALOG_SHOW";

export const ACCOUNT_CHANGE_ADMIN_STATUS = "ACCOUNT_CHANGE_ADMIN_STATUS";
export const accountChangeAdminStatus = adminStatus => ({
  type: ACCOUNT_CHANGE_ADMIN_STATUS,
  adminStatus
});

/**
 * Creates action for external profile dialog show
 *
 * @param {Object} externalProfile
 * @param {String} externalProfile.name
 * @returns {{type: string, externalProfile: *}} action
 */
export const externalProfileDialogShow = externalProfile => ({
  type: EXTERNAL_PROFILE_DIALOG_SHOW,
  externalProfile
});

export const EXTERNAL_PROFILE_DIALOG_HIDE = "EXTERNAL_PROFILE_DIALOG_HIDE";
export const externalProfileDialogHide = () => ({
  type: EXTERNAL_PROFILE_DIALOG_HIDE
});

export const EXTERNAL_PROFILE_UPDATE_REQUEST =
  "EXTERNAL_PROFILE_UPDATE_REQUEST";
export const externalProfileUpdateRequest = (
  externalProfileId,
  externalProfileType,
  customUID
) => ({
  type: EXTERNAL_PROFILE_UPDATE_REQUEST,
  externalProfileId,
  externalProfileType,
  customUID
});

export const PROFILE_UPDATE_DATA_REQUEST = "PROFILE_UPDATE_DATA_REQUEST";
export const profileUpdateDataRequest = (field, data) => ({
  type: PROFILE_UPDATE_DATA_REQUEST,
  field,
  data
});

export const PROFILE_UPDATE_DATA_SUCCESS = "PROFILE_UPDATE_DATA_SUCCESS";
export const profileUpdateDataSuccess = (field, data, customUID) => ({
  type: PROFILE_UPDATE_DATA_SUCCESS,
  field,
  data,
  customUID
});

export const PROFILE_UPDATE_DATA_FAIL = "PROFILE_UPDATE_DATA_FAIL";
export const profileUpdateDataFail = (field, data, reason) => ({
  type: PROFILE_UPDATE_DATA_FAIL,
  field,
  data,
  reason
});

export const EXTERNAL_PROFILE_UPDATE_SUCCESS =
  "EXTERNAL_PROFILE_UPDATE_SUCCESS";
export const externalProfileUpdateSuccess = (
  externalProfileId,
  externalProfileType
) => ({
  type: EXTERNAL_PROFILE_UPDATE_SUCCESS,
  externalProfileId,
  externalProfileType
});

export const EXTERNAL_PROFILE_UPDATE_FAIL = "EXTERNAL_PROFILE_UPDATE_FAIL";
export const externalProfileUpdateFail = (
  externalProfileId,
  externalProfileType,
  reason
) => ({
  type: EXTERNAL_PROFILE_UPDATE_FAIL,
  externalProfileId,
  externalProfileType,
  reason
});

export const EXTERNAL_PROFILE_REFRESH_REQUEST =
  "EXTERNAL_PROFILE_REFRESH_REQUEST";
export const externalProfileRefreshRequest = (
  externalProfileId,
  externalProfileType,
  customUID=null
) => ({
  type: EXTERNAL_PROFILE_REFRESH_REQUEST,
  externalProfileId,
  externalProfileType,
  customUID
});

export const EXTERNAL_PROFILE_REFRESH_SUCCESS =
  "EXTERNAL_PROFILE_REFRESH_SUCCESS";
export const externalProfileRefreshSuccess = (
  externalProfileId,
  externalProfileType
) => ({
  type: EXTERNAL_PROFILE_REFRESH_SUCCESS,
  externalProfileId,
  externalProfileType
});

export const EXTERNAL_PROFILE_REFRESH_FAIL = "EXTERNAL_PROFILE_REFRESH_FAIL";
export const externalProfileRefreshFail = (
  externalProfileId,
  externalProfileType,
  reason
) => ({
  type: EXTERNAL_PROFILE_REFRESH_FAIL,
  externalProfileId,
  externalProfileType,
  reason
});

export const EXTERNAL_PROFILE_REMOVE_DIALOG_SHOW =
  "EXTERNAL_PROFILE_REMOVE_DIALOG_SHOW";
export const externalProfileRemoveDialogShow = (
  externalProfileId,
  externalProfileType
) => ({
  type: EXTERNAL_PROFILE_REMOVE_DIALOG_SHOW,
  externalProfileId,
  externalProfileType
});

export const EXTERNAL_PROFILE_REMOVE_DIALOG_HIDE =
  "EXTERNAL_PROFILE_REMOVE_DIALOG_HIDE";
export const externalProfileRemoveDialogHide = () => ({
  type: EXTERNAL_PROFILE_REMOVE_DIALOG_HIDE
});

export const EXTERNAL_PROFILE_REMOVE_REQUEST =
  "EXTERNAL_PROFILE_REMOVE_REQUEST";
export const externalProfileRemoveRequest = externalProfileType => ({
  type: EXTERNAL_PROFILE_REMOVE_REQUEST,
  externalProfileType
});

export const EXTERNAL_PROFILE_REMOVE_SUCCESS =
  "EXTERNAL_PROFILE_REMOVE_SUCCESS";
export const externalProfileRemoveSuccess = externalProfileType => ({
  type: EXTERNAL_PROFILE_REMOVE_SUCCESS,
  externalProfileType
});

export const EXTERNAL_PROFILE_REMOVE_FAIL = "EXTERNAL_PROFILE_REMOVE_FAIL";
export const externalProfileRemoveFail = externalProfileType => ({
  type: EXTERNAL_PROFILE_REMOVE_FAIL,
  externalProfileType
});

export const DISPLAY_NAME_EDIT_TOGGLE = "DISPLAY_NAME_EDIT_TOGGLE";
export const displayNameEditToggle = status => ({
  type: DISPLAY_NAME_EDIT_TOGGLE,
  status
});

export const DISPLAY_NAME_UPDATE_REQUEST = "DISPLAY_NAME_UPDATE_REQUEST";
export const displayNameUpdateRequest = name => ({
  type: DISPLAY_NAME_UPDATE_REQUEST,
  name
});

export const DISPLAY_NAME_UPDATE_SUCCESS = "DISPLAY_NAME_UPDATE_SUCCESS";
export const displayNameUpdateSuccess = () => ({
  type: DISPLAY_NAME_UPDATE_SUCCESS
});

export const DISPLAY_NAME_UPDATE_FAIL = "DISPLAY_NAME_UPDATE_FAIL";
export const displayNameUpdateFail = reason => ({
  type: DISPLAY_NAME_UPDATE_FAIL,
  reason
});

export const FETCH_USER_DATA = "FETCH_USER_DATA";
export const fetchUserData = () => ({
  type: FETCH_USER_DATA
})

export const FETCH_USER_DATA_SUCCESS = "FETCH_USER_DATA_SUCCESS";
export const fetchUserDataSuccess = data => ({
  type: FETCH_USER_DATA_SUCCESS,
  data
})

export const FETCH_USER_DATA_FAIL = "FETCH_USER_DATA_FAIL";
export const fetchUserDataFail = reason => ({
  type: FETCH_USER_DATA_FAIL,
  reason
});

export const INSPECT_PATH_AS_USER = "INSPECT_PATH_AS_USER";
export const inspectPathAsUser = (pathId, userId) => ({
  type: INSPECT_PATH_AS_USER,
  pathId,
  userId
});
