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

export const SIGN_IN_FAIL = "SIGN_IN_FAIL";
export const signInFail = error => ({
  type: SIGN_IN_FAIL,
  error
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
