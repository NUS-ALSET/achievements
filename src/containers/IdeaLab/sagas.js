import {
  call,
  put,
  takeLatest
} from "redux-saga/effects";
import { delay } from "redux-saga";
import * as actions from "./actions"
import { notificationShow } from "../Root/actions";
import { APP_SETTING } from "../../achievementsApp/config";
import { _CRUDdemoService } from "../../services/CRUDdemo"

// worker saga
export function* handleCreateRequest(action) {
  try {
    yield put(notificationShow("Received the command to Create to CRUDdemo node"))
    yield delay(APP_SETTING.defaultTimeout);
    yield put(notificationShow(`will now write ${action.solution} to \analytics\CRUDdemo node`))
    yield call(_CRUDdemoService.WriteToCRUDdemo, action.solution)
    yield put(actions.createValueSuccess())
    yield delay(APP_SETTING.defaultTimeout);
    yield put(notificationShow("Created successfully!!"))
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
