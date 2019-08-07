import {
  SOLUTION_CLEAR_REQUEST,
  LOGS_CLEAR_REQUEST,
  USER_LOGS_CLEAR_REQUEST,
  MY_PATHS_LOADED,
  MY_COURSES_LOADED,
  MY_ACTIVITIES_LOADED,
  MY_ASSIGNMENTS_LOADED,
  ADD_CUSTOM_ANALYSIS_SUCCESS,
  ANALYSE_SUCCESS,
  ANALYSE_FAIL,
  LOG_ANALYSE_SUCCESS,
  LOG_ANALYSE_FAIL,
  USER_ANALYSE_SUCCESS,
  USER_ANALYSE_FAIL,
  FETCH_SOLUTIONS_SUCCESS,
  FETCH_LOGS_SUCCESS,
  FETCH_USER_LOGS_SUCCESS,
  UPDATE_CUSTOM_ANALYSIS_SUCCESS,
  DELETE_CUSTOM_ANALYSIS_SUCCESS
} from "./actions";

export const customAnalysis = (
  state = {
    dialog: "",
    newCustomAnalysis: {
      customAnalysisUrl: "",
      customAnalysisName: ""
    },
    analysisResults: {},
    logAnalysisResults: {},
    userAnalysisResults: {},
    myPaths: {},
    myCourses: {},
    myActivities: {},
    myAssignments: {},
    solutionsSelected: [],
    logsSelected: [],
    userLogsSelected: []
  },
  action
) => {
  switch (action.type) {
    case SOLUTION_CLEAR_REQUEST:
      return {
        ...state,
        analysisResults: {}
      };
    case LOGS_CLEAR_REQUEST:
      return {
        ...state,
        logAnalysisResults: {}
      };
    case USER_LOGS_CLEAR_REQUEST:
      return {
        ...state,
        userAnalysisResults: {}
      };
    case MY_PATHS_LOADED:
      return {
        ...state,
        dialog: "MY_PATHS_LOADED",
        myPaths: action.myPaths
      };
    case MY_COURSES_LOADED:
      return {
        ...state,
        dialog: "MY_COURSES_LOADED",
        myCourses: action.myCourses
      };
    case MY_ACTIVITIES_LOADED:
      return {
        ...state,
        dialog: "MY_ACTIVITIES_LOADED",
        myActivities: action.myActivities
      };
    case MY_ASSIGNMENTS_LOADED:
      return {
        ...state,
        dialog: "MY_ASSIGNMENTS_LOADED",
        myAssignments: action.myAssignments
      };
    case ADD_CUSTOM_ANALYSIS_SUCCESS:
      return {
        ...state,
        dialog: "ADD_CUSTOM_ANALYSIS_SUCCESS",
        newCustomAnalysis: {
          customAnalysisUrl: action.customAnalysisUrl,
          customAnalysisName: action.customAnalysisName
        }
      };
    case DELETE_CUSTOM_ANALYSIS_SUCCESS:
      return {
        ...state,
        dialog: "DELETE_CUSTOM_ANALYSIS_SUCCESS"
      };
    case UPDATE_CUSTOM_ANALYSIS_SUCCESS:
      return {
        ...state,
        dialog: "UPDATE_CUSTOM_ANALYSIS_SUCCESS"
      };
    case ANALYSE_SUCCESS:
      return {
        ...state,
        dialog: "ANALYSE_SUCCESS",
        analysisResults: action.result
      };
    case ANALYSE_FAIL:
      return {
        ...state,
        dialog: "ANALYSE_FAIL",
        analysisResults: { error: action.error }
      };
    case LOG_ANALYSE_SUCCESS:
      return {
        ...state,
        dialog: "LOG_ANALYSE_SUCCESS",
        logAnalysisResults: action.result
      };
    case LOG_ANALYSE_FAIL:
      return {
        ...state,
        dialog: "LOG_ANALYSE_FAIL",
        logAnalysisResults: { error: action.error }
      };
    case USER_ANALYSE_SUCCESS:
      return {
        ...state,
        dialog: "USER_ANALYSE_SUCCESS",
        userAnalysisResults: action.result
      };
    case USER_ANALYSE_FAIL:
      return {
        ...state,
        dialog: "USER_ANALYSE_SUCCESS",
        userAnalysisResults: { error: action.error }
      };
    case FETCH_SOLUTIONS_SUCCESS:
      return {
        ...state,
        dialog: "FETCH_SOLUTIONS_SUCCESS",
        solutionsSelected: action.solutionsSelected
      };
    case FETCH_LOGS_SUCCESS:
      return {
        ...state,
        dialog: "FETCH_LOGS_SUCCESS",
        logsSelected: action.logsSelected
      };
    case FETCH_USER_LOGS_SUCCESS:
      return {
        ...state,
        dialog: "FETCH_USER_LOGS_SUCCESS",
        userLogsSelected: action.userLogsSelected
      };
    default:
      return state;
  }
};
