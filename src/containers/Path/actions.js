export const PATH_OPEN = "PATH_OPEN";
export const pathOpen = pathId => ({
  type: PATH_OPEN,
  pathId
});

export const PATH_CLOSE = "PATH_CLOSE";
export const pathClose = pathId => ({
  type: PATH_CLOSE,
  pathId
});

export const PATH_OPEN_SOLUTION_DIALOG = "PATH_OPEN_SOLUTION_DIALOG";
export const pathOpenSolutionDialog = (pathId, problemInfo) => ({
  type: PATH_OPEN_SOLUTION_DIALOG,
  pathId,
  problemInfo
});
export const PATH_OPEN_JEST_SOLUTION_DIALOG = "PATH_OPEN_JEST_SOLUTION_DIALOG";
export const pathOpenJestSolutionDialog = (pathId, activityInfo) => ({
  type: PATH_OPEN_JEST_SOLUTION_DIALOG,
  pathId,
  activityInfo
});

export const CLOSE_ACTIVITY_DIALOG = "CLOSE_ACTIVITY_DIALOG";
export const closeActivityDialog = () => ({
  type: CLOSE_ACTIVITY_DIALOG
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

export const PATH_RUN_STATS_DIALOG = "PATH_RUN_STATS_DIALOG";
export const pathRunStatsDialog = (pathId,userId) => ({
  type: PATH_RUN_STATS_DIALOG,
  pathId,
  userId
});

export const PATH_RUN_STATS_INITIATED =
  "PATH_RUN_STATS_INITIATED";
export const pathRunStatsInitiated = (pathId,userId,pathStats) => ({
  type: PATH_RUN_STATS_INITIATED,
  pathId,
  userId,
  pathStats
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

export const PATH_ACTIVITY_OPEN = "PATH_ACTIVITY_OPEN";
export const pathActivityOpen = (pathId, problemId) => ({
  type: PATH_ACTIVITY_OPEN,
  pathId,
  problemId
});

export const PATH_PROFILE_DIALOG_SHOW = "PATH_PROFILE_DIALOG_SHOW";
export const pathProfileDialogShow = () => ({
  type: PATH_PROFILE_DIALOG_SHOW
});

export const PATH_ACTIVITY_CODECOMBAT_OPEN = "PATH_ACTIVITY_CODECOMBAT_OPEN";
export const pathActivityCodeCombatOpen = (
  pathId,
  activityId,
  codeCombatProfile,
  service="CodeCombat"
) => ({
  type: PATH_ACTIVITY_CODECOMBAT_OPEN,
  pathId,
  activityId,
  codeCombatProfile,
  service
});

export const PATH_ACTIVITY_CODECOMBAT_DIALOG_SHOW =
  "PATH_ACTIVITY_CODECOMBAT_DIALOG_SHOW";
export const pathActivityCodeCombatDialogShow = (pathId, activityId) => ({
  type: PATH_ACTIVITY_CODECOMBAT_DIALOG_SHOW,
  pathId,
  activityId
});

export const PATH_REFRESH_SOLUTIONS_REQUEST = "PATH_REFRESH_SOLUTIONS_REQUEST";
export const pathRefreshSolutionsRequest = pathId => ({
  type: PATH_REFRESH_SOLUTIONS_REQUEST,
  pathId
});

export const PATH_REFRESH_SOLUTIONS_SUCCESS = "PATH_REFRESH_SOLUTIONS_SUCCESS";
export const pathRefreshSolutionsSuccess = pathId => ({
  type: PATH_REFRESH_SOLUTIONS_SUCCESS,
  pathId
});

export const PATH_REFRESH_SOLUTIONS_FAIL = "PATH_REFRESH_SOLUTIONS_FAIL";
export const pathRefreshSolutionsFail = (pathId, reason) => ({
  type: PATH_REFRESH_SOLUTIONS_FAIL,
  pathId,
  reason
});

export const FETCH_GITHUB_FILES = "FETCH_GITHUB_FILES";
export const fetchGithubFiles = githubURL => ({
  type: FETCH_GITHUB_FILES,
  githubURL
});

export const FETCH_GITHUB_FILES_LOADING = "FETCH_GITHUB_FILES_LOADING";
export const fetchGithubFilesLoading = () => ({
  type: FETCH_GITHUB_FILES_LOADING
});
export const FETCH_GITHUB_FILES_SUCCESS = "FETCH_GITHUB_FILES_SUCCESS";
export const fetchGithubFilesSuccess = data => ({
  type: FETCH_GITHUB_FILES_SUCCESS,
  data
});
export const FETCH_GITHUB_FILES_ERROR = "FETCH_GITHUB_FILES_ERROR";
export const fetchGithubFilesError = () => ({
  type: FETCH_GITHUB_FILES_ERROR
});

export const FETCH_MY_PATHS_ACTIVITIES = "FETCH_MY_PATHS_ACTIVITIES";
export const fetchMyPathsActivities = pathsInfo => ({
  type: FETCH_MY_PATHS_ACTIVITIES,
  pathsInfo
});

export const SAVE_PROBLEM_TO_DB = "SAVE_PROBLEM_TO_DB";
export const saveProblemToDB = (problem, files) => ({
  type: SAVE_PROBLEM_TO_DB,
  problem,
  files
})

export const SAVE_PROBLEM_TO_DB_SUCCESS = "SAVE_PROBLEM_TO_DB_SUCCESS";
export const saveProblemToDBSuccess = res => ({
  type: SAVE_PROBLEM_TO_DB_SUCCESS,
  res
})

export const SAVE_PROBLEM_TO_DB_FAILURE = "SAVE_PROBLEM_TO_DB_FAILURE";
export const saveProblemToDBFailure = () => ({
  type: SAVE_PROBLEM_TO_DB_FAILURE
})

export const UPDATE_PROBLEM_IN_UI = "UPDATE_PROBLEM_IN_UI";
export const updateProblemInUI = files => ({
  type: UPDATE_PROBLEM_IN_UI,
  files
})

export const ADD_NEW_FILE = "ADD_NEW_FILE"
export const addNewFile = name => ({
  type: ADD_NEW_FILE,
  name
})

export const UPDATE_JEST_FILES = "UPDATE_JEST_FILES";
export const updateJestFiles = files => ({
  type: UPDATE_JEST_FILES,
  files
})

export const REMOVE_JEST_FILE = "REMOVE_JEST_FILE";
export const removeFile = file => {
  return {
    type: REMOVE_JEST_FILE,
    file
  }
}