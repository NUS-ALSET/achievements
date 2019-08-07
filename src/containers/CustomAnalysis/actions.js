export const CUSTOM_ANALYSIS_OPEN = "CUSTOM_ANALYSIS_OPEN";
export const customAnalysisOpen = () => ({
  type: CUSTOM_ANALYSIS_OPEN
});

export const SOLUTION_CLEAR_REQUEST = "SOLUTION_CLEAR_REQUEST";
export const solutionClearRequest = () => ({
  type: SOLUTION_CLEAR_REQUEST
});

export const LOGS_CLEAR_REQUEST = "LOGS_CLEAR_REQUEST";
export const logsClearRequest = () => ({
  type: LOGS_CLEAR_REQUEST
});

export const USER_LOGS_CLEAR_REQUEST = "USER_LOGS_CLEAR_REQUEST";
export const userLogsClearRequest = () => ({
  type: USER_LOGS_CLEAR_REQUEST
});

export const MY_PATHS_LOADED = "MY_PATHS_LOADED";
export const myPathsLoaded = myPaths => ({
  type: MY_PATHS_LOADED,
  myPaths
});

export const MY_COURSES_LOADED = "MY_COURSES_LOADED";
export const myCoursesLoaded = myCourses => ({
  type: MY_COURSES_LOADED,
  myCourses
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

export const LOG_ANALYSE_REQUEST = "LOG_ANALYSE_REQUEST";
export const logAnalyseRequest = (
  typeSelected,
  typeID,
  activityID,
  analysisID,
  queryTypeSelected
) => ({
  type: LOG_ANALYSE_REQUEST,
  typeSelected,
  typeID,
  activityID,
  analysisID,
  queryTypeSelected
});

export const USER_ANALYSE_REQUEST = "USER_ANALYSE_REQUEST";
export const userAnalyseRequest = analysisID => ({
  type: USER_ANALYSE_REQUEST,
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

export const LOG_ANALYSE_SUCCESS = "LOG_ANALYSE_SUCCESS";
export const logAnalyseSuccess = result => ({
  type: LOG_ANALYSE_SUCCESS,
  result
});

export const LOG_ANALYSE_FAIL = "LOG_ANALYSE_FAIL";
export const logAnalyseFail = error => ({
  type: LOG_ANALYSE_FAIL,
  error
});

export const USER_ANALYSE_SUCCESS = "USER_ANALYSE_SUCCESS";
export const userAnalyseSuccess = result => ({
  type: USER_ANALYSE_SUCCESS,
  result
});

export const USER_ANALYSE_FAIL = "USER_ANALYSE_FAIL";
export const userAnalyseFail = error => ({
  type: USER_ANALYSE_FAIL,
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

export const FETCH_LOGS_SUCCESS = "FETCH_LOGS_SUCCESS";
export const fetchLogsSuccess = logsSelected => ({
  type: FETCH_LOGS_SUCCESS,
  logsSelected
});
export const FETCH_USER_LOGS_SUCCESS = "FETCH_USER_LOGS_SUCCESS";
export const fetchUserLogsSuccess = userLogsSelected => ({
  type: FETCH_USER_LOGS_SUCCESS,
  userLogsSelected
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

export const UPDATE_CUSTOM_ANALYSIS_REQUEST = "UPDATE_CUSTOM_ANALYSIS_REQUEST";
export const updateCustomAnalysisRequest = customAnalysisID => ({
  type: UPDATE_CUSTOM_ANALYSIS_REQUEST,
  customAnalysisID
});

export const UPDATE_CUSTOM_ANALYSIS_SUCCESS = "UPDATE_CUSTOM_ANALYSIS_SUCCESS";
export const updateCustomAnalysisSuccess = customAnalysisID => ({
  type: UPDATE_CUSTOM_ANALYSIS_SUCCESS,
  customAnalysisID
});

export const UPDATE_CUSTOM_ANALYSIS_FAIL = "UPDATE_CUSTOM_ANALYSIS_FAIL";
export const updateCustomAnalysisFail = (customAnalysisID, error) => ({
  type: UPDATE_CUSTOM_ANALYSIS_FAIL,
  customAnalysisID,
  error
});
