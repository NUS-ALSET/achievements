import {
  EXTERNAL_PROFILE_DIALOG_HIDE,
  EXTERNAL_PROFILE_DIALOG_SHOW
} from "./actions";

export const account = (
  state = {
    showExternalProfileDialog: false
  },
  action
) => {
  switch (action.type) {
    case EXTERNAL_PROFILE_DIALOG_SHOW:
      return {
        ...state,
        showExternalProfileDialog: true
      };
    case EXTERNAL_PROFILE_DIALOG_HIDE:
      return {
        ...state,
        showExternalProfileDialog: false
      };
    default:
      return state;
  }
};
