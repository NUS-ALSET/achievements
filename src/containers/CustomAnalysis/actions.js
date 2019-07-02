export const CUSTOM_ANALYSIS_OPEN = "CUSTOM_ANALYSIS_OPEN";
export const customAnalysisOpen = () => ({
  type: CUSTOM_ANALYSIS_OPEN
});

export const MY_ACTIVITIES_LOADED = "MY_ACTIVITIES_LOADED";
export const myActivitiesLoaded = myActivities => ({
  type: MY_ACTIVITIES_LOADED,
  myActivities
});

export const MY_ASSIGNMENTS_LOADED = "MY_ASSIGNMENTS_LOADED";
export const myAssignmentsLoaded = myAssignments => ({
  type: MY_ASSIGNMENTS_LOADED,
  myAssignments
});

export const ANALYSE_REQUEST = "ANALYSE_REQUEST";
export const analyseRequest = (
  typeSelected,
  typeID,
  activityID,
  analysisID
) => ({
  type: ANALYSE_REQUEST,
  typeSelected,
  typeID,
  activityID,
  analysisID
});

export const ANALYSE_SUCCESS = "ANALYSE_SUCCESS";
export const analyseSuccess = result => ({
  type: ANALYSE_SUCCESS,
  result
});

export const ANALYSE_FAIL = "ANALYSE_FAIL";
export const analyseFail = error => ({
  type: ANALYSE_FAIL,
  error
});

export const FETCH_SOLUTIONS_SUCCESS = "FETCH_SOLUTIONS_SUCCESS";
export const fetchSolutionsSuccess = solutionsSelected => ({
  type: FETCH_SOLUTIONS_SUCCESS,
  solutionsSelected
});

export const FETCH_SOLUTIONS_FAIL = "FETCH_SOLUTIONS_FAIL";
export const fetchSolutionsFail = error => ({
  type: FETCH_SOLUTIONS_FAIL,
  error
});

export const ADD_CUSTOM_ANALYSIS_REQUEST = "ADD_CUSTOM_ANALYSIS_REQUEST";
export const addCustomAnalysisRequest = (
  customAnalysisUrl,
  customAnalysisName
) => ({
  type: ADD_CUSTOM_ANALYSIS_REQUEST,
  customAnalysisUrl,
  customAnalysisName
});

export const ADD_CUSTOM_ANALYSIS_SUCCESS = "ADD_CUSTOM_ANALYSIS_SUCCESS";
export const addCustomAnalysisSuccess = (
  customAnalysisUrl,
  customAnalysisName
) => ({
  type: ADD_CUSTOM_ANALYSIS_SUCCESS,
  customAnalysisUrl,
  customAnalysisName
});

export const ADD_CUSTOM_ANALYSIS_FAIL = "ADD_CUSTOM_ANALYSIS_FAIL";
export const addCustomAnalysisFail = (
  customAnalysisUrl,
  customAnalysisName,
  error
) => ({
  type: ADD_CUSTOM_ANALYSIS_FAIL,
  customAnalysisUrl,
  customAnalysisName,
  error
});

export const DELETE_CUSTOM_ANALYSIS_REQUEST = "DELETE_CUSTOM_ANALYSIS_REQUEST";
export const deleteCustomAnalysisRequest = customAnalysisID => ({
  type: DELETE_CUSTOM_ANALYSIS_REQUEST,
  customAnalysisID
});

export const DELETE_CUSTOM_ANALYSIS_SUCCESS = "DELETE_CUSTOM_ANALYSIS_SUCCESS";
export const deleteCustomAnalysisSuccess = customAnalysisID => ({
  type: DELETE_CUSTOM_ANALYSIS_SUCCESS,
  customAnalysisID
});

export const DELETE_CUSTOM_ANALYSIS_FAIL = "DELETE_CUSTOM_ANALYSIS_FAIL";
export const deleteCustomAnalysisFail = (customAnalysisID, error) => ({
  type: DELETE_CUSTOM_ANALYSIS_FAIL,
  customAnalysisID,
  error
});
