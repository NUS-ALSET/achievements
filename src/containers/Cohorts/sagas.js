import { call, takeLatest, put, select } from "redux-saga/effects";
import { ADD_COHORT_REQUEST, addCohortFail, addCohortSuccess } from "./actions";
import { cohortsService } from "../../services/cohorts";
import { notificationShow } from "../Root/actions";

export function* addCohortRequestHandler(action) {
  try {
    const auth = yield select(state => state.firebase.auth);
    const cohortKey = yield call(
      cohortsService.addCohort,
      action.cohortData,
      auth.uid,
      auth.displayName
    );
    yield put(addCohortSuccess({ cohortKey, ...action.cohort }));
  } catch (err) {
    yield put(addCohortFail(action.cohort, err.message));
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchAddCohortRequests() {
    yield takeLatest(ADD_COHORT_REQUEST, addCohortRequestHandler);
  }
];
