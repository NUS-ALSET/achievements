import { call, put, takeLatest } from "redux-saga/effects";
import {
  ADMIN_UPDATE_CONFIG_REQUEST,
  adminUpdateConfigFail,
  adminUpdateConfigSuccess,
  ADMIN_CUSTOM_AUTH_REQUEST,
  createNewServiceFaliure,
  createNewServiceSuccess,
  CREATE_NEW_SERVICE,
  fetchServiceDetailsFaliure,
  FETCH_SERVICE_DETAILS,
  fetchServiceDetailsSuccess,
  updateServiceDetailsSuccess,
  updateServiceDetailsFaliure,
  UPDATE_SERVICE_DETAILS,
  deleteServiceSuccess,
  deleteServiceFaliure,
  DELETE_SERVICE,
  TOGGLE_SERVICE,
  toggleServiceSuccess,
  toggleServiceFaliure
} from "./actions";
import { accountService } from "../../services/account";
import { adminService } from "../../services/admin";
import { notificationShow } from "../Root/actions";
import { push } from "connected-react-router";

export function* adminCustomAuthRequestHandler(action) {
  try {
    yield put(notificationShow("Attempt to login with custom UID"));
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
  } catch (err) {
    yield put(fetchServiceDetailsFaliure(err));
  }
}

export function* updateServiceIterator(action) {
  try {
    const data = action.data;
    yield call(adminService.updateService, data);
    yield put(updateServiceDetailsSuccess());
    yield put(notificationShow("Service Updated"));
  } catch (err) {
    yield put(updateServiceDetailsFaliure(err));
  }
}

export function* deleteServiceIterator(action) {
  try {
    const id = action.id;
    yield call(adminService.deleteService, id);
    yield put(deleteServiceSuccess());
    yield put(notificationShow("Service Deleted"));
  } catch (err) {
    yield put(deleteServiceFaliure(err));
  }
}

export function* toggleServiceIterator(action) {
  try {
    const service = action.service;
    yield call(adminService.toggleService, service);
    yield put(toggleServiceSuccess());
    yield put(notificationShow("Service Updated"));
  } catch (err) {
    yield put(toggleServiceFaliure());
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
    yield takeLatest(CREATE_NEW_SERVICE, createNewServiceIterator);
    yield takeLatest(FETCH_SERVICE_DETAILS, fetchServiceDetailsIterator);
    yield takeLatest(UPDATE_SERVICE_DETAILS, updateServiceIterator);
    yield takeLatest(DELETE_SERVICE, deleteServiceIterator);
    yield takeLatest(TOGGLE_SERVICE, toggleServiceIterator);
  }
];
