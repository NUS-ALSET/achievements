import { call, select, takeLatest, put } from "redux-saga/effects";
import {
  PATH_CHANGE_REQUEST,
  PATH_PROBLEM_CHANGE_REQUEST,
  pathChangeSuccess,
  pathDialogHide, pathGAPIAuthorized,
  pathProblemChangeFail,
  pathProblemChangeSuccess
} from "./actions";
import { pathsService } from "../../services/paths";
import { notificationShow } from "../Root/actions";

export function* loginHandler() {
  yield call(pathsService.auth);
  yield put(pathGAPIAuthorized(true));
}

export function* pathChangeRequestHandler(action) {
  const uid = yield select(state => state.firebase.auth.uid);
  const key = yield call(pathsService.pathChange, uid, action.pathInfo);

  yield put(pathChangeSuccess(action.pathInfo, key));
  yield put(pathDialogHide());
}

export function* pathProblemChangeRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    yield call(pathsService.validateProblem, action.problemInfo);
    yield put(pathDialogHide());
    const key = yield call(
      [pathsService, pathsService.problemChange],
      uid,
      action.pathId || "",
      action.problemInfo
    );
    yield put(pathProblemChangeSuccess(action.pathId, action.problemInfo, key));
  } catch (err) {
    yield put(
      pathProblemChangeFail(action.pathId, action.problemInfo, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchLogin() {
    yield takeLatest("@@reactReduxFirebase/LOGIN", loginHandler);
  },
  function* watchPathChangeRequest() {
    yield takeLatest(PATH_CHANGE_REQUEST, pathChangeRequestHandler);
  },
  function* watchPathProblemChangeRequest() {
    yield takeLatest(
      PATH_PROBLEM_CHANGE_REQUEST,
      pathProblemChangeRequestHandler
    );
  }
];
