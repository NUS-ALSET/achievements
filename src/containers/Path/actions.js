export const PATH_OPEN = "PATH_OPEN";
export const pathOpen = pathId => ({
  type: PATH_OPEN,
  pathId
});

export const PATH_OPEN_SOLUTION_DIALOG = "PATH_OPEN_SOLUTION_DIALOG";
export const pathOpenSolutionDialog = (pathId, problemInfo) => ({
  type: PATH_OPEN_SOLUTION_DIALOG,
  pathId,
  problemInfo
});

export const PATH_CLOSE_DIALOG = "PATH_CLOSE_DIALOG";
export const pathCloseDialog = () => ({
  type: PATH_CLOSE_DIALOG
});

// In fact, it only fetches existance of solution, should be renamed?
export const PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS =
  "PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS";
export const pathFetchProblemsSolutionsSuccess = (pathId, solutions) => ({
  type: PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS,
  pathId,
  solutions
});

export const PATH_MORE_PROBLEMS_REQUEST = "PATH_MORE_PROBLEMS_REQUEST";
export const pathMoreProblemsRequest = (userId, pathId, activityCount) => ({
  type: PATH_MORE_PROBLEMS_REQUEST,
  userId,
  pathId,
  activityCount
});

export const PATH_SHOW_COLLABORATORS_DIALOG = "PATH_SHOW_COLLABORATORS_DIALOG";
export const pathShowCollaboratorsDialog = pathId => ({
  type: PATH_SHOW_COLLABORATORS_DIALOG,
  pathId
});

export const PATH_COLLABORATORS_FETCH_SUCCESS =
  "PATH_COLLABORATORS_FETCH_SUCCESS";
export const pathCollaboratorsFetchSuccess = (pathId, assistants) => ({
  type: PATH_COLLABORATORS_FETCH_SUCCESS,
  pathId,
  assistants
});

export const PATH_ADD_COLLABORATOR_REQUEST = "PATH_ADD_COLLABORATOR_REQUEST";
export const pathAddCollaboratorRequest = (pathId, collaboratorId) => ({
  type: PATH_ADD_COLLABORATOR_REQUEST,
  pathId,
  collaboratorId
});

export const PATH_ADD_COLLABORATOR_SUCCESS = "PATH_ADD_COLLABORATOR_SUCCESS";
export const pathAddCollaboratorSuccess = (pathId, collaboratorId) => ({
  type: PATH_ADD_COLLABORATOR_SUCCESS,
  pathId,
  collaboratorId
});

export const PATH_ADD_COLLABORATOR_FAIL = "PATH_ADD_COLLABORATOR_FAIL";
export const pathAddCollaboratorFail = (pathId, collaboratorId, reason) => ({
  type: PATH_ADD_COLLABORATOR_FAIL,
  pathId,
  collaboratorId,
  reason
});

export const PATH_REMOVE_COLLABORATOR_REQUEST =
  "PATH_REMOVE_COLLABORATOR_REQUEST";
export const pathRemoveCollaboratorRequest = (pathId, collaboratorId) => ({
  type: PATH_REMOVE_COLLABORATOR_REQUEST,
  pathId,
  collaboratorId
});

export const PATH_REMOVE_COLLABORATOR_SUCCESS =
  "PATH_REMOVE_COLLABORATOR_SUCCESS";
export const pathRemoveCollaboratorSuccess = (pathId, collaboratorId) => ({
  type: PATH_REMOVE_COLLABORATOR_SUCCESS,
  pathId,
  collaboratorId
});

export const PATH_REMOVE_COLLABORATOR_FAIL = "PATH_REMOVE_COLLABORATOR_FAIL";
export const pathRemoveCollaboratorFail = (pathId, collaboratorId, reason) => ({
  type: PATH_REMOVE_COLLABORATOR_FAIL,
  pathId,
  collaboratorId,
  reason
});

export const PATH_MORE_PROBLEMS_SUCCESS = "PATH_MORE_PROBLEMS_SUCCESS";
export const pathMoreProblemsSuccess = (userId, pathId, activityCount) => ({
  type: PATH_MORE_PROBLEMS_SUCCESS,
  userId,
  pathId,
  activityCount
});

export const PATH_MORE_PROBLEMS_FAIL = "PATH_MORE_PROBLEMS_FAIL";
export const pathMoreProblemsFail = (
  userId,
  pathId,
  activityCount,
  reason
) => ({
  type: PATH_MORE_PROBLEMS_FAIL,
  userId,
  pathId,
  activityCount,
  reason
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
