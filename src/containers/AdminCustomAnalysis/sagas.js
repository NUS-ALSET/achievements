import { call, put, take, select, takeLatest } from "redux-saga/effects";
import {
  ADMIN_CUSTOM_ANALYSIS_OPEN,
  ADD_ADMIN_CUSTOM_ANALYSIS_REQUEST,
  DELETE_ADMIN_CUSTOM_ANALYSIS_REQUEST,
  UPDATE_ADMIN_CUSTOM_ANALYSIS_REQUEST,
  ADMIN_ANALYSE_REQUEST,
  adminStatusLoaded,
  adminStatusError,
  addAdminCustomAnalysisSuccess,
  addAdminCustomAnalysisFail,
  deleteAdminCustomAnalysisSuccess,
  deleteAdminCustomAnalysisFail,
  updateAdminCustomAnalysisSuccess,
  updateAdminCustomAnalysisFail,
  adminAnalyseSuccess,
  adminAnalyseFail
} from "./actions";
import { adminCustomAnalysisService } from "../../services/adminCustomAnalysis";
import { notificationShow } from "../Root/actions";

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

export function* addAdminCustomAnalysisHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    yield call(
      adminCustomAnalysisService.addAdminCustomAnalysis,
      uid,
      action.customAnalysisUrl,
      action.customAnalysisName
    );
    yield put(
      addAdminCustomAnalysisSuccess(
        action.customAnalysisUrl,
        action.customAnalysisName
      )
    );
  } catch (err) {
    yield put(
      addAdminCustomAnalysisFail(
        action.customAnalysisUrl,
        action.customAnalysisName,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* deleteAdminCustomAnalysisHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    yield call(
      adminCustomAnalysisService.deleteAdminCustomAnalysis,
      uid,
      action.customAnalysisID
    );
    yield put(deleteAdminCustomAnalysisSuccess(action.customAnalysisID));
  } catch (err) {
    yield put(
      deleteAdminCustomAnalysisFail(action.customAnalysisID, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* updateAdminCustomAnalysisHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    yield call(
      adminCustomAnalysisService.updateAdminCustomAnalysis,
      uid,
      action.customAnalysisID
    );
    yield put(updateAdminCustomAnalysisSuccess(action.customAnalysisID));
  } catch (err) {
    yield put(
      updateAdminCustomAnalysisFail(action.customAnalysisID, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* onAdminAnalyseHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    let analysisResponse = yield call(
      adminCustomAnalysisService.onAdminAnalyse,
      uid,
      action.adminAnalysisID,
      action.query
    );
    yield put(
      adminAnalyseSuccess(
        action.adminAnalysisID,
        action.query,
        analysisResponse
      )
    );
  } catch (err) {
    yield put(
      adminAnalyseFail(action.adminAnalysisID, action.query, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchAdminCustomAnalysisOpen() {
    yield takeLatest(
      ADMIN_CUSTOM_ANALYSIS_OPEN,
      adminCustomAnalysisOpenHandler
    );
  },
  function* watchAddCustomAnalysis() {
    yield takeLatest(
      ADD_ADMIN_CUSTOM_ANALYSIS_REQUEST,
      addAdminCustomAnalysisHandler
    );
  },
  function* watchDeleteCustomAnalysis() {
    yield takeLatest(
      DELETE_ADMIN_CUSTOM_ANALYSIS_REQUEST,
      deleteAdminCustomAnalysisHandler
    );
  },
  function* watchUpdateCustomAnalysis() {
    yield takeLatest(
      UPDATE_ADMIN_CUSTOM_ANALYSIS_REQUEST,
      updateAdminCustomAnalysisHandler
    );
  },
  function* watchDeleteCustomAnalysis() {
    yield takeLatest(ADMIN_ANALYSE_REQUEST, onAdminAnalyseHandler);
  }
];
