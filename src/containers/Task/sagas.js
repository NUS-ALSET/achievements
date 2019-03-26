import { call, put, select, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";
import {
  TASK_OPEN,
  taskPresetsLoadSuccess,
  TASK_SAVE_REQUEST,
  taskSaveFail,
  taskLoadSuccess
} from "./actions";
import { tasksService } from "../../services/tasks";
import { notificationShow } from "../Root/actions";

export function* taskOpenHandler(action) {
  const presets = yield call(tasksService.fetchPresets);
  yield put(taskPresetsLoadSuccess(presets));
  if (action.taskId !== "new") {
    const task = yield call(tasksService.fetchTask, action.taskId);
    yield put(taskLoadSuccess(action.taskId, task));
  }
}

export function* taskSaveRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    const taskId = yield call(
      tasksService.saveTask,
      uid,
      action.taskId,
      action.taskInfo
    );
    if (action.taskId === "new") {
      yield put(push("/tasks/" + taskId));
    }
  } catch (err) {
    yield put(taskSaveFail(action.taskId, err.message));
    yield put(notificationShow(err.message));
  }
}

export const sagas = [
  function* watchTaskOpen() {
    yield takeLatest(TASK_OPEN, taskOpenHandler);
  },
  function* watchTaskSaveRequest() {
    yield takeLatest(TASK_SAVE_REQUEST, taskSaveRequestHandler);
  }
];