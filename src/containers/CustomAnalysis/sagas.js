import { call, put, take, select, takeLatest } from "redux-saga/effects";
import {
  CUSTOM_ANALYSIS_OPEN,
  ADD_CUSTOM_ANALYSIS_REQUEST,
  ANALYSE_REQUEST,
  LOG_ANALYSE_REQUEST,
  USER_ANALYSE_REQUEST,
  DELETE_CUSTOM_ANALYSIS_REQUEST,
  UPDATE_CUSTOM_ANALYSIS_REQUEST,
  myPathsLoaded,
  myCoursesLoaded,
  myActivitiesLoaded,
  myAssignmentsLoaded,
  addCustomAnalysisSuccess,
  addCustomAnalysisFail,
  analyseSuccess,
  analyseFail,
  logAnalyseSuccess,
  logAnalyseFail,
  userAnalyseSuccess,
  userAnalyseFail,
  fetchSolutionsSuccess,
  fetchLogsSuccess,
  fetchUserLogsSuccess,
  deleteCustomAnalysisSuccess,
  deleteCustomAnalysisFail,
  updateCustomAnalysisSuccess,
  updateCustomAnalysisFail
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
    let myPaths, myCourses, myActivities, myAssignments;

    // Fetch all user created/collaborated paths by user
    myPaths = yield call(customAnalysisService.fetchMyPaths, uid);
    yield put(myPathsLoaded(myPaths));

    // Fetch all activities for user related paths
    myActivities = yield call(customAnalysisService.fetchMyActivities, myPaths);
    yield put(myActivitiesLoaded(myActivities));

    // Fetch all user created/assisted courses by user
    myCourses = yield call(customAnalysisService.fetchMyCourses, uid);
    yield put(myCoursesLoaded(myCourses));

    //Fetch all assignments for user related courses
    myAssignments = yield call(
      customAnalysisService.fetchMyAssignments,
      myCourses
    );
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

export function* deleteCustomAnalysisHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    yield call(
      customAnalysisService.deleteCustomAnalysis,
      uid,
      action.customAnalysisID
    );
    yield put(deleteCustomAnalysisSuccess(action.customAnalysisID));
  } catch (err) {
    yield put(deleteCustomAnalysisFail(action.customAnalysisID, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* updateCustomAnalysisHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    yield call(
      customAnalysisService.updateCustomAnalysis,
      uid,
      action.customAnalysisID
    );
    yield put(updateCustomAnalysisSuccess(action.customAnalysisID));
  } catch (err) {
    yield put(updateCustomAnalysisFail(action.customAnalysisID, err.message));
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
    result = result
      ? result
      : { results: { htmlFeedback: "Empty response, please check logs" } };
    yield put(analyseSuccess(result));
  } catch (err) {
    yield put(analyseFail(err.message));
    yield put(notificationShow(err.message));
  }
}

export function* logAnalyseHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    // Fetch logs
    let logsSelected = yield call(
      customAnalysisService.fetchLogsHandler,
      action.queryTypeSelected,
      action.typeSelected,
      action.typeID,
      action.activityID
    );
    yield put(fetchLogsSuccess(logsSelected));
    // [Enhancement] : Can store the logs in redux state for downloading
    // Call Analysis on logs
    let result = yield call(
      customAnalysisService.logAnalyseHandler,
      uid,
      logsSelected,
      action.analysisID
    );
    result = result
      ? result
      : { results: { htmlFeedback: "Empty response, please check logs" } };
    yield put(logAnalyseSuccess(result));
  } catch (err) {
    yield put(logAnalyseFail(err.message));
    yield put(notificationShow(err.message));
  }
}

export function* userAnalyseHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }
    // Fetch logs
    let userLogsSelected = yield call(
      customAnalysisService.fetchUserLogsHandler,
      uid
    );
    yield put(fetchUserLogsSuccess(userLogsSelected));
    // [Enhancement] : Can store the logs in redux state for downloading
    // Call Analysis on logs
    let result = yield call(
      customAnalysisService.logAnalyseHandler,
      uid,
      userLogsSelected,
      action.analysisID
    );
    result = result
      ? result
      : { results: { htmlFeedback: "Empty response, please check logs" } };
    yield put(userAnalyseSuccess(result));
  } catch (err) {
    yield put(userAnalyseFail(err.message));
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
  },
  function* watchLogAnalyse() {
    yield takeLatest(LOG_ANALYSE_REQUEST, logAnalyseHandler);
  },
  function* watchUserAnalyse() {
    yield takeLatest(USER_ANALYSE_REQUEST, userAnalyseHandler);
  },
  function* watchDeleteCustomAnalysis() {
    yield takeLatest(
      DELETE_CUSTOM_ANALYSIS_REQUEST,
      deleteCustomAnalysisHandler
    );
  },
  function* watchUpdateCustomAnalysis() {
    yield takeLatest(
      UPDATE_CUSTOM_ANALYSIS_REQUEST,
      updateCustomAnalysisHandler
    );
  }
];
