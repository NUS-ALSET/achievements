export const LOGIN_MENU_OPEN = "LOGIN_MENU_OPEN";
export const loginMenuOpen = anchorElId => ({
  type: LOGIN_MENU_OPEN,
  anchorElId
});

export const LOGIN_MENU_CLOSE = "LOGIN_MENU_CLOSE";
export const loginMenuClose = () => ({
  type: LOGIN_MENU_CLOSE
});

export const MAIN_DRAWER_TOGGLE = "MAIN_DRAWER_TOGGLE";
export const mainDrawerToggle = status => ({
  type: MAIN_DRAWER_TOGGLE,
  status
});

export const LOGIN_AUTHENTICATION = "LOGIN_AUTHENTICATION";
export const loginAuthentication = (userId, displayName) => ({
  type: LOGIN_AUTHENTICATION,
  userId,
  displayName
});

export const LOGIN_DEAUTHENTICATION = "LOGIN_DEAUTHENTICATION";
export const loginDeauthentication = () => ({
  type: LOGIN_DEAUTHENTICATION
});
