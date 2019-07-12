import {
  ADMIN_STATUS_LOADED,
  ADMIN_STATUS_ERROR,
  ADD_ADMIN_CUSTOM_ANALYSIS_SUCCESS,
  UPDATE_ADMIN_CUSTOM_ANALYSIS_SUCCESS,
  DELETE_ADMIN_CUSTOM_ANALYSIS_SUCCESS,
  ADMIN_ANALYSE_SUCCESS,
  ADMIN_ANALYSE_FAIL
} from "./actions";

export const adminCustomAnalysis = (
  state = {
    dialog: "",
    isAdmin: false,
    error: "",
    newCustomAnalysis: {
      customAnalysisUrl: "",
      customAnalysisName: ""
    },
    analysisResponse: {}
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
    case UPDATE_ADMIN_CUSTOM_ANALYSIS_SUCCESS:
      return {
        ...state,
        dialog: "UPDATE_ADMIN_CUSTOM_ANALYSIS_SUCCESS"
      };
    case ADMIN_ANALYSE_SUCCESS:
      return {
        ...state,
        dialog: "ADMIN_ANALYSE_SUCCESS",
        analysisResponse: action.analysisResponse
      };
    case ADMIN_ANALYSE_FAIL:
      return {
        ...state,
        dialog: "ADMIN_ANALYSE_FAIL",
        error: action.error
      };
    default:
      return state;
  }
};
