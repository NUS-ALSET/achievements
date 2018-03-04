import {
  PROBLEM_INIT_REQUEST,
  problemInitFail,
  problemInitSuccess
} from "./actions";
import { call, put, select, take, takeLatest } from "redux-saga/effects";
import { pathsService } from "../../services/paths";
import { notificationShow } from "../Root/actions";

export function* problemInitRequestHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      take("@@reactReduxFirebase/LOGIN");
      yield select(state => state.firebase.auth.uid);
    }

    const problemJSON = yield call(
      [pathsService, pathsService.fetchProblemFile],
      action.problemOwner,
      action.problemId
    );

    yield put(
      problemInitSuccess(action.problemOwner, action.problemId, problemJSON)
    );
  } catch (err) {
    yield put(
      problemInitFail(action.problemOwner, action.problemId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchProblemInitRequest() {
    yield takeLatest(PROBLEM_INIT_REQUEST, problemInitRequestHandler);
  }
];
