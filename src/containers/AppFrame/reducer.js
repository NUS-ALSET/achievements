import {
  LOGIN_AUTHENTICATION,
  LOGIN_DEAUTHENTICATION,
  LOGIN_MENU_CLOSE,
  LOGIN_MENU_OPEN,
  MAIN_DRAWER_TOGGLE
} from "./actions";

export const appFrame = (
  state = {
    user: {
      id: "",
      displayName: ""
    },
    dropdownAnchorEl: false,
    mainDrawerOpen: false
  },
  action
) => {
  switch (action.type) {
    case LOGIN_MENU_OPEN:
      return {
        ...state,
        dropdownAnchorEl: action.anchorEl
      };
    case LOGIN_MENU_CLOSE:
      return {
        ...state,
        dropdownAnchorEl: false
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
    default:
      return state;
  }
};
