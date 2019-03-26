import { call, put, select, take, takeLatest } from "redux-saga/effects";

import { TASKS_OPEN, tasksLoadFail, tasksLoadSuccess } from "./actions";
import { tasksService } from "../../services/tasks";
import { notificationShow } from "../Root/actions";

export function* tasksOpenHandler() {
  let uid = yield select(state => state.firebase.auth.uid);
  if (!uid) {
    yield take("@@reactReduxFirebase/LOGIN");
    uid = yield select(state => state.firebase.auth.uid);
  }
  try {
    const tasks = yield call(tasksService.fetchTasks, uid);
    yield put(tasksLoadSuccess(tasks));
  } catch (err) {
    yield put(tasksLoadFail(err.message));
    yield put(notificationShow(err.message));
  }
}

export const sagas = [
  function* watchTasksOpen() {
    yield takeLatest(TASKS_OPEN, tasksOpenHandler);
  }
];
