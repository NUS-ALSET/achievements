import { call, takeLatest, put } from "redux-saga/effects";

import { tasksService } from "../../services/tasks";
import {
  TASKS_DELETE_TASK_REQUEST,
  tasksDeleteTaskFail,
  tasksDeleteTaskSuccess
} from "./actions";
import { notificationShow } from "../Root/actions";

export function* tasksDeleteTaskRequestHandler(action) {
  try {
    yield call(tasksService.removeTask, action.taskId);
    yield put(tasksDeleteTaskSuccess(action.taskId));
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(tasksDeleteTaskFail(action.taskId, err.message));
  }
}

export const sagas = [
  function* watchTasksDeleteTaskRequest() {
    yield takeLatest(TASKS_DELETE_TASK_REQUEST, tasksDeleteTaskRequestHandler);
  }
];
