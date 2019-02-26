import {
  call,
  put,
  takeLatest
} from "redux-saga/effects";
import { delay } from "redux-saga";
import * as actions from "./actions"
import { notificationShow } from "../Root/actions";
import { APP_SETTING } from "../../achievementsApp/config";
import { _CRUDdemoService } from "../../services/CRUDdemo";

// worker saga
export function* handleCreateRequest(action) {
  try {
    yield put(notificationShow("Received the command to Create @ CRUDdemo node"))
    yield delay(APP_SETTING.defaultTimeout);
    // eslint-disable-next-line
    yield put(notificationShow(`will now write [${action.solution}] to \analytics\CRUDdemo node`))
    yield call(_CRUDdemoService.WriteToCRUDdemo, action.solution)
    yield put(actions.createValueSuccess())
    yield delay(APP_SETTING.defaultTimeout);
    yield put(notificationShow("Created successfully!!"))
  } catch (err) {
    yield put(notificationShow("Failed to create for CRUDdemo"));
    console.error("CRUDdemo error: ", err)
  }
}

export function* handleDeleteRequest() {
  try {
    yield put(notificationShow("Received the command to Delete @ CRUDdemo node"))
    yield delay(APP_SETTING.defaultTimeout);
    // eslint-disable-next-line
    yield put(notificationShow(`will now delete your CRUDdemo data`))
    yield call(_CRUDdemoService.DeleteCRUDdemoData)
    yield put(actions.deleteValueSuccess())
    yield delay(APP_SETTING.defaultTimeout);
    yield put(notificationShow("Deleted successfully!!"))
  } catch (err) {
    yield put(notificationShow("Failed to delete your CRUDdemo data"));
    console.error("CRUDdemo error: ", err)
  }
}

export function* handleFetchActivityAttempts(action) {
  try {
    let response = yield call(_CRUDdemoService.fetchActivityAttempts, action.path);
    if (response) {
      response = Object.keys(response).length && Object.keys(response).reduce((acc, el) => {
        if (response[el].completed) acc[el] = response[el];
        return acc;
      }, {});
      yield put(actions.fetchActivityAttemptsSuccess(response));
    } else yield put(actions.fetchActivityAttemptsFaliure("No data found!"))
  } catch (err) {
    yield put(notificationShow("Failed fetch activity attempts"));
    console.error("Failed to fetch activity attempts: ", err)
  }
}

// watcher saga
export default [
  function* watchCreateToCRUDdemo() {
    yield takeLatest(actions.CREATE_TO_CRUD_DEMO, handleCreateRequest);
  },
  function* watchDeleteToCRUDdemo() {
    yield takeLatest(actions.DELETE_TO_CRUD_DEMO, handleDeleteRequest);
  },
  function* watchFetchActivityAttempts() {
    yield takeLatest(actions.FETCH_ACTIVITY_ATTEMPTS, handleFetchActivityAttempts);
  }
];
