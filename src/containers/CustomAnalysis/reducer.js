import {
  MY_PATHS_LOADED,
  MY_COURSES_LOADED,
  MY_ACTIVITIES_LOADED,
  MY_ASSIGNMENTS_LOADED,
  ADD_CUSTOM_ANALYSIS_SUCCESS,
  ANALYSE_SUCCESS,
  ANALYSE_FAIL,
  FETCH_SOLUTIONS_SUCCESS,
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
    myPaths: {},
    myCourses: {},
    myActivities: {},
    myAssignments: {},
    solutionsSelected: []
  },
  action
) => {
  switch (action.type) {
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
        analysisResults: action.error
      };
    case FETCH_SOLUTIONS_SUCCESS:
      return {
        ...state,
        dialog: "FETCH_SOLUTIONS_SUCCESS",
        solutionsSelected: action.solutionsSelected
      };
    default:
      return state;
  }
};
