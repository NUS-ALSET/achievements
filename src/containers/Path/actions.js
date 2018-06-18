export const PATH_OPEN = "PATH_OPEN";
export const pathOpen = pathId => ({
  type: PATH_OPEN,
  pathId
});

// In fact, it only fetches existance of solution, should be renamed?
export const PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS =
  "PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS";
export const pathFetchProblemsSolutionsSuccess = (pathId, solutions) => ({
  type: PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS,
  pathId,
  solutions
});

export const PATH_TOGGLE_JOIN_STATUS_REQUEST =
  "PATH_TOGGLE_JOIN_STATUS_REQUEST";
export const pathToggleJoinStatusRequest = (userId, pathId, status) => ({
  type: PATH_TOGGLE_JOIN_STATUS_REQUEST,
  userId,
  pathId,
  status
});

export const PATH_TOGGLE_JOIN_STATUS_SUCCESS =
  "PATH_TOGGLE_JOIN_STATUS_SUCCESS";
export const pathToggleJoinStatusSuccess = (pathId, status) => ({
  type: PATH_TOGGLE_JOIN_STATUS_SUCCESS,
  pathId,
  status
});

export const PATH_TOGGLE_JOIN_STATUS_FAIL = "PATH_TOGGLE_JOIN_STATUS_FAIL";
export const pathToggleJoinStatusFail = (pathId, status, reason) => ({
  type: PATH_TOGGLE_JOIN_STATUS_FAIL,
  pathId,
  status,
  reason
});

export const PATH_PROBLEM_OPEN = "PATH_PROBLEM_OPEN";
export const pathProblemOpen = (pathId, problemId) => ({
  type: PATH_PROBLEM_OPEN,
  pathId,
  problemId
});
