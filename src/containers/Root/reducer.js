import {
  ACCEPT_EULA_SUCCESS,
  NOTIFICATION_HIDE,
  NOTIFICATION_SHOW,
  SHOW_ACCEPT_EULA_DIALOG,
  SIGN_IN_REQUIRE,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  VERSION_CHANGE
} from "./actions";

export const root = (
  state = {
    requireAcceptEULA: false,
    requireSignIn: false,
    needRefresh: false,
    notification: {
      show: false,
      message: ""
    }
  },
  action
) => {
  switch (action.type) {
    case SHOW_ACCEPT_EULA_DIALOG:
      return {
        ...state,
        requireAcceptEULA: true
      };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        requireAcceptEULA: false
      };
    case ACCEPT_EULA_SUCCESS:
      return {
        ...state,
        requireAcceptEULA: false
      };
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        requireSignIn: false
      };
    case SIGN_IN_REQUIRE:
      return {
        ...state,
        requireSignIn: true
      };
    case VERSION_CHANGE:
      return {
        ...state,
        needRefresh: action.needRefresh
      };
    case NOTIFICATION_SHOW:
      return {
        ...state,
        notification: {
          show: true,
          message: action.message
        }
      };
    case NOTIFICATION_HIDE:
      return {
        ...state,
        notification: {
          show: false,
          message: ""
        }
      };
    default:
      return state;
  }
};
