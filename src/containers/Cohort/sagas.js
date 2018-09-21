import { call, put, select, take, takeLatest } from "redux-saga/effects";
import {
  COHORT_COURSES_RECALCULATE_REQUEST,
  cohortCoursesRecalculateFail,
  cohortCoursesRecalculateSuccess
} from "./actions";
import { cohortsService } from "../../services/cohorts";
import { selectCohort } from "./selectors";

function* cohortRecalculationRequestHandle(action) {
  let data = yield select(state => ({
    uid: state.firebase.auth.uid,
    cohort: selectCohort(state, { match: { params: action } })
  }));

  // If no uid then wait for login
  if (!data.uid) {
    yield take("@@reactReduxFirebase/LOGIN");
  }

  try {
    yield call(
      [cohortsService, cohortsService.recalculateCourses],
      action.cohortId,
      data.cohort
    );
    yield put(cohortCoursesRecalculateSuccess(action.cohortId));
  } catch (err) {
    yield put(cohortCoursesRecalculateFail(err.message));
  }
}

export default [
  function* watchCohortRecalculationRequest() {
    yield takeLatest(
      COHORT_COURSES_RECALCULATE_REQUEST,
      cohortRecalculationRequestHandle
    );
  }
];
