import { call, select, takeLatest, put } from "redux-saga/effects";
import {
  PATH_CHANGE_REQUEST,
  pathChangeSuccess,
  pathDialogHide
} from "./actions";
import { pathsService } from "../../services/paths";

export function* pathChangeRequestHandler(action) {
  const uid = yield select(state => state.firebase.auth.uid);
  const key = yield call(pathsService.pathChange, uid, action.pathInfo);
  yield put(pathChangeSuccess(action.pathInfo, key));
  yield put(pathDialogHide());
}

export function* loginHandler() {
  const token = yield select(
    state => state.firebase.auth.stsTokenManager.accessToken
  );

  yield call(pathsService.auth, token);
  yield call(pathsService.fetchFile, "1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF");
}

export default [
  function* watchPathChangeRequest() {
    yield takeLatest(PATH_CHANGE_REQUEST, pathChangeRequestHandler);
  },
  function* watchLogin() {
    yield takeLatest("@@reactReduxFirebase/LOGIN", loginHandler);
  }
];
