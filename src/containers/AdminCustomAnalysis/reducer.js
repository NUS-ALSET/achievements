import { ADMIN_STATUS_LOADED, ADMIN_STATUS_ERROR } from "./actions";

export const adminCustomAnalysis = (
  state = {
    dialog: "",
    isAdmin: false,
    error: ""
  },
  action
) => {
  switch (action.type) {
    case ADMIN_STATUS_LOADED:
      return {
        ...state,
        dialog: "ADMIN_CUSTOM_ANALYSIS_OPEN",
        isAdmin: action.isAdmin
      };
    case ADMIN_STATUS_ERROR:
      return {
        ...state,
        dialog: "ADMIN_CUSTOM_ANALYSIS_OPEN",
        isAdmin: action.isAdmin,
        error: action.error
      };
    default:
      return state;
  }
};
