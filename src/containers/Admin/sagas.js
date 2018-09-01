import { call, put, takeLatest } from "redux-saga/effects";
import {
  ADMIN_UPDATE_CONFIG_REQUEST,
  adminUpdateConfigFail,
  adminUpdateConfigSuccess
} from "./actions";
import { accountService } from "../../services/account";
import { notificationShow } from "../Root/actions";

function* adminUpdateConfigRequestHandler(action) {
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
  function* watchAdminUpdateConfigRequest() {
    yield takeLatest(
      ADMIN_UPDATE_CONFIG_REQUEST,
      adminUpdateConfigRequestHandler
    );
  }
];
