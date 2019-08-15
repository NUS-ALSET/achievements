import {
  LOGIN_MENU_CLOSE,
  LOGIN_MENU_OPEN,
  MAIN_DRAWER_TOGGLE,
  GET_DYNAMIC_PATHTITLE,
  SAVE_PROMO_CODE
} from "./actions";

export const initialState = {
  dropdownAnchorElId: false,
  mainDrawerOpen: false,
  dynamicPathTitle: "",
  promocode:""
};

export const appFrame = (state = initialState, action) => {
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
    case MAIN_DRAWER_TOGGLE:
      return {
        ...state,
        mainDrawerOpen:
          action.status === undefined ? !state.mainDrawerOpen : action.status
      };
    case GET_DYNAMIC_PATHTITLE:
      return {
        ...state,
        dynamicPathTitle: action.pathname
          ? action.pathname === "/"
            ? "Achievements"
            : action.pathname
                .replace(/^\//, "")
                .replace(/\b[a-z]/g, name => name.toUpperCase())
                .replace(/[/].*/, "")
          : "getting the title"
      };
    case SAVE_PROMO_CODE:
      return {
        ...state,
        promocode: action.code
      };
    default:
      return state;
  }
};
