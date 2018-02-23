import { call, select, take, takeLatest } from "redux-saga/effects";
import { COHORT_COURSES_RECALCULATE_REQUEST } from "./actions";
import { cohortsService } from "../../services/cohorts";

function* cohortRecalculationRequestHandle(action) {
  let uid = yield select(state => state.firebase.auth.uid);

  // If no uid then wait for login
  if (!uid) {
    yield take("@@reactReduxFirebase/LOGIN");
  }
  yield call(
    [cohortsService, cohortsService.recalculateCourses],
    action.cohortId
  );
}

export default [
  function* watchCohortRecalculationRequest() {
    yield takeLatest(
      COHORT_COURSES_RECALCULATE_REQUEST,
      cohortRecalculationRequestHandle
    );
  }
];
