export const NOTIFICATION_SHOW = "NOTIFICATION_SHOW";
export const notificationShow = message => ({
  type: NOTIFICATION_SHOW,
  message
});

export const NOTIFICATION_HIDE = "NOTIFICATION_HIDE";
export const notificationHide = () => ({
  type: NOTIFICATION_HIDE
});

export const SIGN_IN_REQUEST = "SIGN_IN_REQUEST";
export const signInRequest = () => ({
  type: SIGN_IN_REQUEST
});

export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const signInSuccess = () => ({
  type: SIGN_IN_SUCCESS
});

export const SIGN_OUT_REQUEST = "SIGN_OUT_REQUEST";
export const signOutRequest = () => ({
  type: SIGN_OUT_REQUEST
});

export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS
});

export const ACCEPT_EULA_REQUEST = "ACCEPT_EULA_REQUEST";
export const acceptEulaRequest = () => ({
  type: ACCEPT_EULA_REQUEST
});

export const ACCEPT_EULA_SUCCESS = "ACCEPT_EULA_SUCCESS";
export const acceptEulaSuccess = () => ({
  type: ACCEPT_EULA_SUCCESS
});

export const ACCEPT_EULA_FAIL = "ACCEPT_EULA_FAIL";
export const acceptEulaFail = error => ({
  type: ACCEPT_EULA_FAIL,
  error
});

export const SHOW_ACCEPT_EULA_DIALOG = "SHOW_ACCEPT_EULA_DIALOG";
export const showAcceptEulaDialog = () => ({
  type: SHOW_ACCEPT_EULA_DIALOG
});

export const ROUTE_CHANGE = "ROUTE_CHANGE";
export const routeChange = (pathname, method) => ({
  type: ROUTE_CHANGE,
  pathname,
  method
});

export const VERSION_CHANGE = "VERSION_CHANGE";
export const versionChange = needRefresh => ({
  type: VERSION_CHANGE,
  needRefresh
});

export const SIGN_IN_REQUIRE = "SIGN_IN_REQUIRE";
export const signInRequire = () => ({
  type: SIGN_IN_REQUIRE
});

// constants
export const SOLUTION_PRIVATE_LINK = "PRIVATE_LINK";
export const SOLUTION_MODIFIED_TESTS = "MODIFIED_TESTS";
export const SOLUTION_PROCESSING_TIMEOUT = "PROCESSING_TIMEOUT";
