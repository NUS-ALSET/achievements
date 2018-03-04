export const PROBLEM_INIT_REQUEST = "PROBLEM_INIT_REQUEST";
export const problemInitRequest = (problemOwner, problemId) => ({
  type: PROBLEM_INIT_REQUEST,
  problemId,
  problemOwner
});

export const PROBLEM_INIT_SUCCESS = "PROBLEM_INIT_SUCCESS";
export const problemInitSuccess = (problemOwner, problemId, payload) => ({
  type: PROBLEM_INIT_SUCCESS,
  problemId,
  problemOwner,
  payload
});

export const PROBLEM_INIT_FAIL = "PROBLEM_INIT_FAIL";
export const problemInitFail = (problemOwner, problemId, reason) => ({
  type: PROBLEM_INIT_FAIL,
  problemId,
  problemOwner,
  reason
});
