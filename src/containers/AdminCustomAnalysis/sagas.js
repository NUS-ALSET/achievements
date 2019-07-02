import { call, put, take, select, takeLatest } from "redux-saga/effects";
import {
  ADMIN_CUSTOM_ANALYSIS_OPEN,
  adminStatusLoaded,
  adminStatusError
} from "./actions";
import { adminCustomAnalysisService } from "../../services/adminCustomAnalysis";

export function* adminCustomAnalysisOpenHandler() {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    if (uid) {
      const adminStatusResponse = yield call(
        adminCustomAnalysisService.checkAdminStatus,
        uid
      );
      const adminStatus = adminStatusResponse ? adminStatusResponse : false;
      yield put(adminStatusLoaded(adminStatus));
    } else {
      yield put(adminStatusLoaded(false));
    }
  } catch (err) {
    adminStatusError(false, err.message);
  }
}

export default [
  function* watchAdminCustomAnalysisOpen() {
    yield takeLatest(
      ADMIN_CUSTOM_ANALYSIS_OPEN,
      adminCustomAnalysisOpenHandler
    );
  }
];
