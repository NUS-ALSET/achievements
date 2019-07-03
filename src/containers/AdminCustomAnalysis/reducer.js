import {
  ADMIN_STATUS_LOADED,
  ADMIN_STATUS_ERROR,
  ADD_ADMIN_CUSTOM_ANALYSIS_SUCCESS,
  DELETE_ADMIN_CUSTOM_ANALYSIS_SUCCESS
} from "./actions";

export const adminCustomAnalysis = (
  state = {
    dialog: "",
    isAdmin: false,
    error: "",
    newCustomAnalysis: {
      customAnalysisUrl: "",
      customAnalysisName: ""
    }
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
    case ADD_ADMIN_CUSTOM_ANALYSIS_SUCCESS:
      return {
        ...state,
        dialog: "ADD_ADMIN_CUSTOM_ANALYSIS_SUCCESS",
        newCustomAnalysis: {
          customAnalysisUrl: action.customAnalysisUrl,
          customAnalysisName: action.customAnalysisName
        }
      };
    case DELETE_ADMIN_CUSTOM_ANALYSIS_SUCCESS:
      return {
        ...state,
        dialog: "DELETE_ADMIN_CUSTOM_ANALYSIS_SUCCESS"
      };
    default:
      return state;
  }
};
