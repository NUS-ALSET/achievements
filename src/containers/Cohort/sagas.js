import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  COHORT_COURSE_UPDATE_REQUEST,
  COHORT_COURSES_RECALCULATE_REQUEST,
  COHORT_OPEN,
  COHORT_UPDATE_ASSISTANTS_REQUEST,
  SET_COHORT_QUALIFICATION_CONDITION_REQUEST,
  COHORT_RECALCULATE_QUALIFIED_MEMBERS_REQUEST,
  cohortCoursesRecalculateFail,
  cohortCoursesRecalculateRequest,
  cohortCoursesRecalculateSuccess,
  cohortCourseUpdateFail,
  cohortCourseUpdateSuccess,
  cohortFetchSuccess,
  cohortUpdateAssistantsFail,
  cohortUpdateAssistantsSuccess,
  COHORT_ANALYTICS_DATA_REQUEST,
  cohortAnalyticsDataRequestSuccess,
  setCohortQualificationConditionSuccess
} from "./actions";
import { cohortsService } from "../../services/cohorts";
import { notificationShow } from "../Root/actions";

export function* cohortOpenHandle(action) {
  let uid = yield select(state => ((((state || {}).firebase || {}).auth || {}).uid));

  try {
    const cohortData = yield call(
      [cohortsService, cohortsService.fetchCohort],
      uid,
      action.cohortId,
      !!uid
    );
    if (uid && cohortData.needRecount) {
      yield put(cohortCoursesRecalculateRequest(cohortData.id));
    }
    yield put(cohortFetchSuccess(cohortData));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* cohortRecalculationRequestHandler(action) {
  let uid = yield select(state => ((((state || {}).firebase || {}).auth || {}).uid));

  try {
    yield call(
      [cohortsService, cohortsService.recalculateCourses],
      action.cohortId
    );
    yield put(cohortCoursesRecalculateSuccess(action.cohortId));
    const cohortData = yield call(
      [cohortsService, cohortsService.fetchCohort],
      uid,
      action.cohortId,
      true
    );
    yield put(cohortFetchSuccess(cohortData));
  } catch (err) {
    yield put(cohortCoursesRecalculateFail(err.message));
  }
}

export function* cohortCourseUpdateRequestHandler(action) {
  try {
    yield call(
      [
        cohortsService,
        action.kind === "add"
          ? cohortsService.addCourse
          : cohortsService.removeCourse
      ],
      action.cohortId,
      action.courseId
    );
    if (action.kind === "add") {
      yield put(cohortCoursesRecalculateRequest(action.cohortId));
    }
    yield put(
      cohortCourseUpdateSuccess(action.cohortId, action.courseId, action.kind)
    );
  } catch (err) {
    yield put(
      cohortCourseUpdateFail(
        action.cohortId,
        action.courseId,
        action.kind,
        err.message
      )
    );
    yield notificationShow(err.message);
  }
}

export function* cohortUpdateAssistantRequestHandler(action) {
  try {
    yield call(cohortsService.updateAssistants, action);
    yield put(
      cohortUpdateAssistantsSuccess(
        action.cohortId,
        action.assistantId,
        action.action
      )
    );
  } catch (err) {
    yield put(
      cohortUpdateAssistantsFail(
        action.cohortId,
        action.assistantId,
        action.action,
        err.message
      )
    );
    yield notificationShow(err.message);
  }
}

export function* cohortAnalyticsDataRequestHandler(action) {
  try {
  const uid = yield select(state => state.firebase.auth.uid);
  const analyticsData = yield call(
    cohortsService.addTaskToCohortAnalyticsQueue,
    { cohortId: action.cohortId, uid }
    );
  yield put(
    cohortAnalyticsDataRequestSuccess(
      action.cohortId,
      analyticsData
    )
  )
  }catch(err){

  }
}

export function* setCohortQualificationConditionRequestHandler(action){
  try{
    yield call(
      cohortsService.setCohortQualificationCondition,
      action.cohortId,
      action.conditionData
    )
    yield put(setCohortQualificationConditionSuccess(action.cohortId,action.conditionData))
    yield put(notificationShow("Condition Added Successfully"));

  }catch(err){
    yield put(notificationShow(err.message));
  }
}

export function* cohortRecalculateQualifiedMembersRequesttHandler(action){
  try{
    yield call(
      cohortsService.cohortUpdateQualificationCalculateTime,
      action.cohortId
    )
  }catch(err){
    yield put(notificationShow(err.message));
  }
}



export default [
  function* watchCohortOpen() {
    yield takeLatest(COHORT_OPEN, cohortOpenHandle);
  },
  function* watchCohortRecalculationRequest() {
    yield takeLatest(
      COHORT_COURSES_RECALCULATE_REQUEST,
      cohortRecalculationRequestHandler
    );
  },
  function* watchCohortCourseUpdateRequest() {
    yield takeLatest(
      COHORT_COURSE_UPDATE_REQUEST,
      cohortCourseUpdateRequestHandler
    );
  },
  function* watchCohortUpdateAssistantRequest() {
    yield takeLatest(
      COHORT_UPDATE_ASSISTANTS_REQUEST,
      cohortUpdateAssistantRequestHandler
    );
  },
  function* watchCohortAnalyticsDataRequestt() {
    yield takeLatest(
      COHORT_ANALYTICS_DATA_REQUEST,
      cohortAnalyticsDataRequestHandler
    );
  },
  function* watchsetCohortQualificationConditionRequests() {
    yield takeLatest(
      SET_COHORT_QUALIFICATION_CONDITION_REQUEST,
      setCohortQualificationConditionRequestHandler
      );
  },
  function* watchcohortRecalculateQualifiedMembersRequests() {
    yield takeLatest(
      COHORT_RECALCULATE_QUALIFIED_MEMBERS_REQUEST,
      cohortRecalculateQualifiedMembersRequesttHandler
      );
  }
];
