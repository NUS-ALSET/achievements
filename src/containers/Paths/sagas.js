import { call, select, take, takeLatest, put } from "redux-saga/effects";
import {
  PATH_CHANGE_REQUEST,
  PATH_ACTIVITY_CHANGE_REQUEST,
  pathChangeSuccess,
  pathDialogHide,
  pathGAPIAuthorized,
  pathActivityChangeFail,
  pathProblemChangeSuccess,
  PATHS_OPEN,
  pathsJoinedFetchSuccess
} from "./actions";
import { pathsService } from "../../services/paths";
import { notificationShow } from "../Root/actions";
import {
  PATH_TOGGLE_JOIN_STATUS_SUCCESS,
  pathCloseDialog
} from "../Path/actions";

export function* loginHandler(action) {
  // Auth GAPI to download files from google drive
  yield call([pathsService, pathsService.auth]);
  yield put(pathGAPIAuthorized(true));

  const joinedPaths = yield call(
    [pathsService, pathsService.fetchJoinedPaths],
    action.auth.uid
  );

  yield put(pathsJoinedFetchSuccess(joinedPaths));
}

export function* pathsOpenHandler() {
  const uid = yield select(state => state.firebase.auth.uid);

  if (!uid) {
    yield take(PATH_TOGGLE_JOIN_STATUS_SUCCESS);
  }
}

export function* pathChangeRequestHandler(action) {
  const uid = yield select(state => state.firebase.auth.uid);
  try {
    const key = yield call(
      [pathsService, pathsService.pathChange],
      uid,
      action.pathInfo
    );

    yield put(pathChangeSuccess(action.pathInfo, key));
    yield put(pathDialogHide());
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* pathActivityChangeRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    yield call(
      [pathsService, pathsService.validateProblem],
      action.activityInfo
    );
    yield put(pathDialogHide());
    const key = yield call(
      [pathsService, pathsService.problemChange],
      uid,
      action.pathId || "",
      action.activityInfo
    );
    yield put(
      pathProblemChangeSuccess(action.pathId, action.activityInfo, key)
    );
    yield put(notificationShow("Problem Saved"));
    yield put(pathCloseDialog());
  } catch (err) {
    yield put(
      pathActivityChangeFail(action.pathId, action.activityInfo, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchLogin() {
    yield takeLatest("@@reactReduxFirebase/LOGIN", loginHandler);
  },
  function* watchPathsOpen() {
    yield takeLatest(PATHS_OPEN, pathsOpenHandler);
  },
  function* watchPathChangeRequest() {
    yield takeLatest(PATH_CHANGE_REQUEST, pathChangeRequestHandler);
  },
  function* watchPathActivityChangeRequest() {
    yield takeLatest(
      PATH_ACTIVITY_CHANGE_REQUEST,
      pathActivityChangeRequestHandler
    );
  }
];
