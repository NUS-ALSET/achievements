import {
  ACCEPT_EULA_SUCCESS,
  NOTIFICATION_HIDE,
  NOTIFICATION_SHOW,
  SHOW_ACCEPT_EULA_DIALOG,
  SIGN_OUT_SUCCESS
} from "./actions";

export const root = (
  state = {
    requireAcceptEULA: false,
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
          ...state.notification,
          show: false
        }
      };
    default:
      return state;
  }
};
