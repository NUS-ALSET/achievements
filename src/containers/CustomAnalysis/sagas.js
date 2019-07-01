import { call, put, take, select, takeLatest } from "redux-saga/effects";
import {
  CUSTOM_ANALYSIS_OPEN,
  ADD_CUSTOM_ANALYSIS_REQUEST,
  ANALYSE_REQUEST,
  myActivitiesLoaded,
  myAssignmentsLoaded,
  addCustomAnalysisSuccess,
  addCustomAnalysisFail,
  analyseSuccess,
  analyseFail,
  fetchSolutionsSuccess
} from "./actions";
import { customAnalysisService } from "../../services/customAnalysis.js";
import { notificationShow } from "../Root/actions";

export function* customAnalysisOpenHandler() {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    let myActivities, myAssignments;
    myActivities = yield call(customAnalysisService.fetchMyActivities, uid);
    myAssignments = yield call(customAnalysisService.fetchMyAssignments, uid);
    yield put(myActivitiesLoaded(myActivities));
    yield put(myAssignmentsLoaded(myAssignments));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* addCustomAnalysisHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    yield call(
      customAnalysisService.addCustomAnalysis,
      uid,
      action.customAnalysisUrl,
      action.customAnalysisName
    );
    yield put(
      addCustomAnalysisSuccess(
        action.customAnalysisUrl,
        action.customAnalysisName
      )
    );
  } catch (err) {
    yield put(
      addCustomAnalysisFail(
        action.customAnalysisUrl,
        action.customAnalysisName,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* analyseHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    let solutionsSelected = yield call(
      customAnalysisService.fetchSolutionsHandler,
      action.typeSelected,
      action.typeID,
      action.activityID
    );
    yield put(fetchSolutionsSuccess(solutionsSelected));
    let result = yield call(
      customAnalysisService.analyseHandler,
      uid,
      solutionsSelected,
      action.analysisID
    );
    yield put(analyseSuccess(result));
  } catch (err) {
    yield put(analyseFail(err.message));
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchCustomAnalysisOpen() {
    yield takeLatest(CUSTOM_ANALYSIS_OPEN, customAnalysisOpenHandler);
  },
  function* watchAddCustomAnalysis() {
    yield takeLatest(ADD_CUSTOM_ANALYSIS_REQUEST, addCustomAnalysisHandler);
  },
  function* watchAnalyse() {
    yield takeLatest(ANALYSE_REQUEST, analyseHandler);
  }
];
