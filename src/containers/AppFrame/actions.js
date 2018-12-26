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

export const GET_DYNAMIC_PATHTITLE = "GET_DYNAMIC_PATHTITLE";
export const getDynamicPathtitle = pathname => ({
  type: GET_DYNAMIC_PATHTITLE,
  pathname
});
