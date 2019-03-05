import { call, put, takeLatest } from "redux-saga/effects";
import {
  ADMIN_UPDATE_CONFIG_REQUEST,
  adminUpdateConfigFail,
  adminUpdateConfigSuccess,
  createNewServiceFaliure,
  createNewServiceSuccess,
  CREATE_NEW_SERVICE,
  fetchServiceDetailsFaliure,
  FETCH_SERVICE_DETAILS,
  fetchServiceDetailsSuccess
} from "./actions";
import { accountService } from "../../services/account";
import { adminService } from "../../services/admin";
import { notificationShow } from "../Root/actions";

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

export function* createNewServiceIterator(action) {
  try {
    const data = action.data;
    yield call(adminService.createService, data);
    yield put(createNewServiceSuccess());
    yield put(notificationShow("Service Created"));
  } catch (err) {
    yield put(createNewServiceFaliure(err));
  }
}

export function* fetchServiceDetailsIterator(action) {
  try {
    const id = action.id;
    const service = yield call(adminService.fetchServiceDetails, id);
    yield put(fetchServiceDetailsSuccess(service));
    // yield put(notificationShow("Service Created"));
  } catch (err) {
    yield put(fetchServiceDetailsFaliure(err));
  }
}

export default [
  function* watchAdminUpdateConfigRequest() {
    yield takeLatest(
      ADMIN_UPDATE_CONFIG_REQUEST,
      adminUpdateConfigRequestHandler
    );
    yield takeLatest(
      CREATE_NEW_SERVICE,
      createNewServiceIterator
    );
    yield takeLatest(
      FETCH_SERVICE_DETAILS,
      fetchServiceDetailsIterator
    )
  }
];
