import {
  LOGIN_AUTHENTICATION,
  LOGIN_DEAUTHENTICATION,
  LOGIN_MENU_CLOSE,
  LOGIN_MENU_OPEN,
  MAIN_DRAWER_TOGGLE,
  GET_DYNAMIC_PATHTITLE
} from "./actions";

export const appFrame = (
  state = {
    user: {
      id: "",
      displayName: ""
    },
    dropdownAnchorElId: false,
    mainDrawerOpen: false,
    dynamicPathTitle: ""
  },
  action
) => {
  switch (action.type) {
    case LOGIN_MENU_OPEN:
      return {
        ...state,
        dropdownAnchorElId: action.anchorElId
      };
    case LOGIN_MENU_CLOSE:
      return {
        ...state,
        dropdownAnchorElId: false
      };
    case LOGIN_AUTHENTICATION:
      return {
        ...state,
        user: {
          id: action.userId,
          displayName: action.displayName
        }
      };
    case LOGIN_DEAUTHENTICATION:
      return {
        ...state,
        user: {
          id: "",
          displayName: ""
        }
      };
    case MAIN_DRAWER_TOGGLE:
      return {
        ...state,
        mainDrawerOpen:
          action.status === undefined ? !state.mainDrawerOpen : action.status
      };
    case GET_DYNAMIC_PATHTITLE:
      return {
          ...state,
          dynamicPathTitle:
            action.pathname
              ? action.pathname === "/"
                ? "Achievements"
                : action.pathname
                  .replace(/^\//, "")
                  .replace(/\b[a-z]/g, name => name.toUpperCase())
                  .replace(/[/].*/, "")
              : "getting the title"
      };
    default:
      return state;
  }
};
