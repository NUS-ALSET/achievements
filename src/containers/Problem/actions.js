export const PROBLEM_INIT_REQUEST = "PROBLEM_INIT_REQUEST";
export const problemInitRequest = (pathId, problemId) => ({
  type: PROBLEM_INIT_REQUEST,
  problemId,
  pathId
});

export const PROBLEM_INIT_SUCCESS = "PROBLEM_INIT_SUCCESS";
export const problemInitSuccess = (pathId, problemId, payload) => ({
  type: PROBLEM_INIT_SUCCESS,
  problemId,
  pathId,
  payload
});

export const PROBLEM_INIT_FAIL = "PROBLEM_INIT_FAIL";
export const problemInitFail = (pathId, problemId, reason) => ({
  type: PROBLEM_INIT_FAIL,
  problemId,
  pathId,
  reason
});

export const PROBLEM_SOLVE_REQUEST = "PROBLEM_SOLVE_REQUEST";
export const problemSolveRequest = problemId => ({
  type: PROBLEM_SOLVE_REQUEST,
  problemId
});

export const PROBLEM_SOLVE_SUCCESS = "PROBLEM_SOLVE_SUCCESS";
export const problemSolveSuccess = (problemId, solutionKey) => ({
  type: PROBLEM_SOLVE_SUCCESS,
  problemId,
  solutionKey
});

export const PROBLEM_SOLVE_FAIL = "PROBLEM_SOLVE_FAIL";
export const problemSolveFail = (problemId, reason) => ({
  type: PROBLEM_SOLVE_FAIL,
  problemId,
  reason
});

export const PROBLEM_SOLUTION_REFRESH_REQUEST =
  "PROBLEM_SOLUTION_REFRESH_REQUEST";
export const problemSolutionRefreshRequest = problemId => ({
  type: PROBLEM_SOLUTION_REFRESH_REQUEST,
  problemId
});

export const PROBLEM_SOLUTION_REFRESH_SUCCESS =
  "PROBLEM_SOLUTION_REFRESH_SUCCESS";
export const problemSolutionRefreshSuccess = (problemId, payload) => ({
  type: PROBLEM_SOLUTION_REFRESH_SUCCESS,
  problemId,
  payload
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
