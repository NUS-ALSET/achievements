export const COHORTS_CHANGE_TAB = "COHORTS_CHANGE_TAB";
export const cohortsChangeTab = tabIndex => ({
  type: COHORTS_CHANGE_TAB,
  tabIndex
});

export const ADD_COHORT_DIALOG_SHOW = "ADD_COHORT_DIALOG_SHOW";
export const addCohortDialogShow = cohort => ({
  type: ADD_COHORT_DIALOG_SHOW,
  cohort
});

export const ADD_COHORT_DIALOG_HIDE = "ADD_COHORT_DIALOG_HIDE";
export const addCohortDialogHide = () => ({
  type: ADD_COHORT_DIALOG_HIDE
});

export const ADD_COHORT_REQUEST = "ADD_COHORT_REQUEST";
export const addCohortRequest = cohortData => ({
  type: ADD_COHORT_REQUEST,
  cohortData
});

export const ADD_COHORT_SUCCESS = "ADD_COHORT_SUCCESS";
export const addCohortSuccess = (name, key) => ({
  type: ADD_COHORT_SUCCESS,
  name,
  key
});

export const ADD_COHORT_FAIL = "ADD_COHORT_FAIL";
export const addCohortFail = (name, reason) => ({
  type: ADD_COHORT_FAIL,
  name,
  reason
});

export const REMOVE_COHORT_DIALOG_SHOW = "REMOVE_COHORT_DIALOG_SHOW";
export const removeCohortDialogShow = (cohortId, cohortName) => ({
  type: REMOVE_COHORT_DIALOG_SHOW,
  cohortId,
  cohortName
});

export const REMOVE_COHORT_DIALOG_HIDE = "REMOVE_COHORT_DIALOG_HIDE";
export const removeCohortDialogHide = () => ({
  type: REMOVE_COHORT_DIALOG_HIDE
});
