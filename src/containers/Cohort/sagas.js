import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  COHORT_COURSES_RECALCULATE_REQUEST,
  COHORT_OPEN,
  COHORT_UPDATE_ASSISTANTS_REQUEST,
  cohortCoursesRecalculateFail,
  cohortCoursesRecalculateRequest,
  cohortCoursesRecalculateSuccess,
  cohortFetchSuccess,
  cohortUpdateAssistantsFail,
  cohortUpdateAssistantsSuccess
} from "./actions";
import { cohortsService } from "../../services/cohorts";
import { notificationShow } from "../Root/actions";

function* cohortOpenHandle(action) {
  let uid = yield select(state => state.firebase.auth.uid);

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

function* cohortRecalculationRequestHandle(action) {
  let uid = yield select(state => state.firebase.auth.uid);

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

function* cohortUpdateAssistantRequestHandler(action) {
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

export default [
  function* watchCohortOpen() {
    yield takeLatest(COHORT_OPEN, cohortOpenHandle);
  },
  function* watchCohortRecalculationRequest() {
    yield takeLatest(
      COHORT_COURSES_RECALCULATE_REQUEST,
      cohortRecalculationRequestHandle
    );
  },
  function* watchCohortUpdateAssistantRequest() {
    yield takeLatest(
      COHORT_UPDATE_ASSISTANTS_REQUEST,
      cohortUpdateAssistantRequestHandler
    );
  }
];
