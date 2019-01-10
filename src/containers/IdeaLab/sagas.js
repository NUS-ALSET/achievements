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
export function* handleCreateRequest() {
  yield put(notificationShow("Received the command to Create to CRUDdemo node"))
  yield delay(APP_SETTING.defaultTimeout);
  yield put(notificationShow("you still there?"));
}

// watcher saga
export default [
  function* watchCreateToCRUDdemo() {
    yield takeLatest(actions.CREATE_TO_CRUD_DEMO, handleCreateRequest);
  }
];
