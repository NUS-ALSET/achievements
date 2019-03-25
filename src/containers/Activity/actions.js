export const PROBLEM_INIT_REQUEST = "PROBLEM_INIT_REQUEST";
export const problemInitRequest = (
  pathId,
  problemId,
  solution,
  readOnly = false
) => ({
  type: PROBLEM_INIT_REQUEST,
  problemId,
  pathId,
  solution,
  readOnly
});

export const PROBLEM_INIT_SUCCESS = "PROBLEM_INIT_SUCCESS";
export const problemInitSuccess = (
  pathId,
  problemId,
  payload,
  readOnly = false
) => ({
  type: PROBLEM_INIT_SUCCESS,
  problemId,
  pathId,
  payload,
  readOnly
});

export const PROBLEM_INIT_FAIL = "PROBLEM_INIT_FAIL";
export const problemInitFail = (pathId, problemId, reason) => ({
  type: PROBLEM_INIT_FAIL,
  problemId,
  pathId,
  reason
});

export const PROBLEM_FINALIZE = "PROBLEM_FINALIZE";
export const problemFinalize = () => ({
  type: PROBLEM_FINALIZE
});

export const PROBLEM_SOLVE_UPDATE = "PROBLEM_SOLVE_UPDATE";
export const problemSolveUpdate = (pathId, problemId, fileId, openTime = null) => {
  return ({
  type: PROBLEM_SOLVE_UPDATE,
  pathId,
  problemId,
  fileId,
  openTime
});}

export const PROBLEM_SOLVE_SUCCESS = "PROBLEM_SOLVE_SUCCESS";
export const problemSolveSuccess = (problemId, solutionKey) => ({
  type: PROBLEM_SOLVE_SUCCESS,
  problemId,
  solutionKey
});

export const PROBLEM_SOLUTION_REFRESH_REQUEST =
  "PROBLEM_SOLUTION_REFRESH_REQUEST";
export const problemSolutionRefreshRequest = (problemId, fileId, openTime) => ({
  type: PROBLEM_SOLUTION_REFRESH_REQUEST,
  problemId,
  fileId,
  openTime
});

export const PROBLEM_SOLUTION_REFRESH_SUCCESS =
  "PROBLEM_SOLUTION_REFRESH_SUCCESS";
export const problemSolutionRefreshSuccess = (problemId, payload) => ({
  type: PROBLEM_SOLUTION_REFRESH_SUCCESS,
  problemId,
  payload
});

export const PROBLEM_SOLUTION_EXECUTION_STATUS =
  "PROBLEM_SOLUTION_EXECUTION_STATUS";
export const problemSolutionExecutionStatus = payload => ({
  type: PROBLEM_SOLUTION_EXECUTION_STATUS,
  payload
});

export const PROBLEM_SOLUTION_CALCULATED_WRONG =
  "PROBLEM_SOLUTION_CALCULATED_WRONG";
export const problemSolutionCalculatedWrong = () => ({
  type: PROBLEM_SOLUTION_CALCULATED_WRONG
});

export const PROBLEM_SOLUTION_PROVIDED_SUCCESS =
  "PROBLEM_SOLUTION_PROVIDED_SUCCESS";
export const problemSolutionProvidedSuccess = (problemId, payload) => ({
  type: PROBLEM_SOLUTION_PROVIDED_SUCCESS,
  problemId,
  payload
});

export const PROBLEM_CHECK_SOLUTION_REQUEST = "PROBLEM_CHECK_SOLUTION_REQUEST";
export const problemCheckSolutionRequest = (problemId, fileId, solution) => ({
  type: PROBLEM_CHECK_SOLUTION_REQUEST,
  problemId,
  fileId,
  solution
});

export const PROBLEM_CHECK_SOLUTION_SUCCESS = "PROBLEM_CHECK_SOLUTION_SUCCESS";
export const problemCheckSolutionSuccess = (problemId, fileId, solution) => ({
  type: PROBLEM_CHECK_SOLUTION_SUCCESS,
  problemId,
  fileId,
  solution
});

export const PROBLEM_CHECK_SOLUTION_FAIL = "PROBLEM_CHECK_SOLUTION_FAIL";
export const problemCheckSolutionFail = (
  problemId,
  fileId,
  solution,
  reason
) => ({
  type: PROBLEM_CHECK_SOLUTION_FAIL,
  problemId,
  fileId,
  solution,
  reason
});

export const PROBLEM_SOLUTION_REFRESH_FAIL = "PROBLEM_SOLUTION_REFRESH_FAIL";
export const problemSolutionRefreshFail = (problemId, reason) => ({
  type: PROBLEM_SOLUTION_REFRESH_FAIL,
  problemId,
  reason
});

export const PROBLEM_SOLUTION_SUBMIT_REQUEST =
  "PROBLEM_SOLUTION_SUBMIT_REQUEST";
export const problemSolutionSubmitRequest = (pathId, problemId, payload) => ({
  type: PROBLEM_SOLUTION_SUBMIT_REQUEST,
  pathId,
  problemId,
  payload
});

export const PROBLEM_SOLUTION_SUBMIT_SUCCESS =
  "PROBLEM_SOLUTION_SUBMIT_SUCCESS";
export const problemSolutionSubmitSuccess = (pathId, problemId, payload) => ({
  type: PROBLEM_SOLUTION_SUBMIT_SUCCESS,
  pathId,
  problemId,
  payload
});

export const PROBLEM_SOLUTION_SUBMIT_FAIL = "PROBLEM_SOLUTION_SUBMIT_FAIL";
export const problemSolutionSubmitFail = (
  pathId,
  problemId,
  payload,
  reason
) => ({
  type: PROBLEM_SOLUTION_SUBMIT_FAIL,
  pathId,
  problemId,
  payload,
  reason
});

export const PROBLEM_SOLUTION_ATTEMPT_REQUEST =
  "PROBLEM_SOLUTION_ATTEMPT_REQUEST";
export const problemSolutionAttemptRequest = (activityKey, pathKey, activityType, completed, open, time) => ({
  type: PROBLEM_SOLUTION_ATTEMPT_REQUEST,
  payload: {
    activityKey,
    pathKey,
    activityType,
    completed,
    open,
    time
  }
});

export const SET_PROBLEM_OPEN_TIME = 'SET_PROBLEM_OPEN_TIME';
export const setProblemOpenTime = (problemId,openTime) => ({
  type: SET_PROBLEM_OPEN_TIME,
  problemId,
  openTime
})