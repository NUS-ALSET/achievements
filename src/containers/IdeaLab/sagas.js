import {
  call,
  put,
  take,
  takeLatest,
  spawn
} from "redux-saga/effects";
import { delay } from "redux-saga";
import * as actions from "./actions"
import { notificationShow } from "../Root/actions";
import { APP_SETTING } from "../../achievementsApp/config";

// worker saga
export function* handleCreateRequest(action) {
  try {
    yield put(notificationShow("Received the command to Create to CRUDdemo node"))
    yield delay(APP_SETTING.defaultTimeout);
    yield put(notificationShow(`will now write ${action.solution} to \analytics\CRUDdemo node`))
  } catch (err) {
    yield put(notificationShow("Failed to create to CRUDdemo"));
    console.error("CRUDdemo error: ", err)
  }
}

// watcher saga
export default [
  function* watchCreateToCRUDdemo() {
    yield takeLatest(actions.CREATE_TO_CRUD_DEMO, handleCreateRequest);
  }
];
