export const COHORT_OPEN = "COHORT_OPEN";
export const cohortOpen = cohortId => ({
  type: COHORT_OPEN,
  cohortId
});

export const COHORT_FETCH_SUCCESS = "COHORT_FETCH_SUCCESS";
export const cohortFetchSuccess = cohortData => ({
  type: COHORT_FETCH_SUCCESS,
  cohortData
});

export const COHORT_COURSES_RECALCULATE_REQUEST =
  "COHORT_COURSES_RECALCULATE_REQUEST";
export const cohortCoursesRecalculateRequest = cohortId => ({
  type: COHORT_COURSES_RECALCULATE_REQUEST,
  cohortId
});

export const COHORT_COURSES_RECALCULATE_FAIL =
  "COHORT_COURSES_RECALCULATE_FAIL";
export const cohortCoursesRecalculateFail = cohortId => ({
  type: COHORT_COURSES_RECALCULATE_FAIL,
  cohortId
});

export const COHORT_COURSES_RECALCULATE_SUCCESS =
  "COHORT_COURSES_RECALCULATE_SUCCESS";
export const cohortCoursesRecalculateSuccess = cohortId => ({
  type: COHORT_COURSES_RECALCULATE_SUCCESS,
  cohortId
});

export const COHORT_COURSE_RECALCULATE_REQUEST =
  "COHORT_COURSE_RECALCULATE_REQUEST";
export const cohortCourseRecalculateRequest = (cohortId, courseId) => ({
  type: COHORT_COURSE_RECALCULATE_REQUEST,
  cohortId,
  courseId
});

export const COHORT_COURSE_RECALCULATE_SUCCESS =
  "COHORT_COURSE_RECALCULATE_SUCCESS";
export const cohortCourseRecalculateSuccess = (cohortId, courseId) => ({
  type: COHORT_COURSE_RECALCULATE_SUCCESS,
  cohortId,
  courseId
});

export const COHORT_COURSE_RECALCULATE_FAIL = "COHORT_COURSE_RECALCULATE_FAIL";
export const cohortCourseRecalculateFail = (cohortId, courseId) => ({
  type: COHORT_COURSE_RECALCULATE_FAIL,
  cohortId,
  courseId
});

export const COHORT_COURSE_UPDATE_REQUEST = "COHORT_COURSE_UPDATE_REQUEST";
export const cohortCourseUpdateRequest = (cohortId, courseId, kind) => ({
  type: COHORT_COURSE_UPDATE_REQUEST,
  cohortId,
  courseId,
  kind
});

export const COHORT_COURSE_UPDATE_SUCCESS = "COHORT_COURSE_UPDATE_SUCCESS";
export const cohortCourseUpdateSuccess = (cohortId, courseId, kind) => ({
  type: COHORT_COURSE_UPDATE_SUCCESS,
  cohortId,
  courseId,
  kind
});

export const COHORT_COURSE_UPDATE_FAIL = "COHORT_COURSE_UPDATE_FAIL";
export const cohortCourseUpdateFail = (cohortId, courseId, kind, reason) => ({
  type: COHORT_COURSE_UPDATE_FAIL,
  cohortId,
  courseId,
  kind,
  reason
});

export const COHORT_SORT_CHANGE = "COHORT_SORT_CHANGE";
export const cohortSortChange = sortField => ({
  type: COHORT_SORT_CHANGE,
  sortField
});

export const COHORT_OPEN_ASSISTANTS_DIALOG = "COHORT_OPEN_ASSISTANTS_DIALOG";
export const cohortOpenAssistantsDialog = cohortId => ({
  type: COHORT_OPEN_ASSISTANTS_DIALOG,
  cohortId
});

export const COHORT_CLOSE_DIALOG = "COHORT_CLOSE_DIALOG";
export const cohortCloseDialog = () => ({
  type: COHORT_CLOSE_DIALOG
});

export const COHORT_UPDATE_ASSISTANTS_REQUEST =
  "COHORT_UPDATE_ASSISTANTS_REQUEST";
export const cohortUpdateAssistantsRequest = (
  cohortId,
  assistantId,
  action
) => ({
  type: COHORT_UPDATE_ASSISTANTS_REQUEST,
  cohortId,
  assistantId,
  action
});

export const COHORT_UPDATE_ASSISTANTS_SUCCESS =
  "COHORT_UPDATE_ASSISTANTS_SUCCESS";
export const cohortUpdateAssistantsSuccess = (
  cohortId,
  assistantId,
  action
) => ({
  type: COHORT_UPDATE_ASSISTANTS_SUCCESS,
  cohortId,
  assistantId,
  action
});

export const COHORT_UPDATE_ASSISTANTS_FAIL = "COHORT_UPDATE_ASSISTANTS_FAIL";
export const cohortUpdateAssistantsFail = (
  cohortId,
  assistantId,
  action,
  reason
) => ({
  type: COHORT_UPDATE_ASSISTANTS_FAIL,
  cohortId,
  assistantId,
  action,
  reason
});

export const COHORT_ANALYTICS_DATA_REQUEST = "COHORT_ANALYTICS_DATA_REQUEST";
export const cohortAnalyticsDataRequest = (
  cohortId,
) => ({
  type: COHORT_ANALYTICS_DATA_REQUEST,
  cohortId,
});

export const COHORT_ANALYTICS_DATA_REQUEST_SUCCESS = "COHORT_ANALYTICS_DATA_REQUEST_SUCCESS";
export const cohortAnalyticsDataRequestSuccess = (
  cohortId, data
) => ({
  type: COHORT_ANALYTICS_DATA_REQUEST_SUCCESS,
  cohortId,
  data
});
export const COHORT_ANALYTICS_DATA_REQUEST_FAIL = "COHORT_ANALYTICS_DATA_REQUEST_FAIL";
export const cohortAnalyticsDataRequestFail = (
  cohortId,
  reason
) => ({
  type: COHORT_ANALYTICS_DATA_REQUEST_FAIL,
  cohortId,
  reason
});

export const SET_COHORT_QUALIFICATION_CONDITION_REQUEST = "SET_COHORT_QUALIFICATION_CONDITION_REQUEST";
export const setCohortQualificationConditionRequest = (cohortId, conditionData) => ({
  type: SET_COHORT_QUALIFICATION_CONDITION_REQUEST,
  cohortId,
  conditionData
});

export const SET_COHORT_QUALIFICATION_CONDITION_SUCCESS = "SET_COHORT_QUALIFICATION_CONDITION_SUCCESS";
export const setCohortQualificationConditionSuccess = (cohortId, conditionData) => ({
  type: SET_COHORT_QUALIFICATION_CONDITION_SUCCESS,
  cohortId,
  conditionData
});

export const COHORT_RECALCULATE_QUALIFIED_MEMBERS_REQUEST = "COHORT_RECALCULATE_QUALIFIED_MEMBERS_REQUEST";
export const cohortRecalculateQualifiedMembersRequest = (cohortId) => ({
  type: COHORT_RECALCULATE_QUALIFIED_MEMBERS_REQUEST,
  cohortId
});