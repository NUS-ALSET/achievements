import { call, put, takeLatest } from "redux-saga/effects";
import {
  ADMIN_UPDATE_CONFIG_REQUEST,
  adminUpdateConfigFail,
  adminUpdateConfigSuccess,
  ADMIN_CUSTOM_AUTH_REQUEST
} from "./actions";
import { accountService } from "../../services/account";
import { notificationShow } from "../Root/actions";
import { push } from "connected-react-router";

export function* adminCustomAuthRequestHandler(action) {
  try {
    yield call(accountService.authWithCustomToken, action.uid);
    yield put(push("/"));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* adminUpdateConfigRequestHandler(action) {
  try {
    yield call(accountService.updateAdminConfig, action.config);
    yield put(adminUpdateConfigSuccess(action.config));
    yield put(notificationShow("Config updated"));
  } catch (err) {
    yield put(adminUpdateConfigFail(action.config, err.message));
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchAdminCustomAuthRequest() {
    yield takeLatest(ADMIN_CUSTOM_AUTH_REQUEST, adminCustomAuthRequestHandler);
  },
  function* watchAdminUpdateConfigRequest() {
    yield takeLatest(
      ADMIN_UPDATE_CONFIG_REQUEST,
      adminUpdateConfigRequestHandler
    );
  }
];
