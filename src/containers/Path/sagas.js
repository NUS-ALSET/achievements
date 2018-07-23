import { call, put, select, take, takeLatest } from "redux-saga/effects";
import {
  PATH_MORE_PROBLEMS_REQUEST,
  PATH_OPEN,
  PATH_PROBLEM_OPEN,
  PATH_TOGGLE_JOIN_STATUS_REQUEST,
  pathFetchProblemsSolutionsSuccess,
  pathMoreProblemsFail,
  pathMoreProblemsSuccess,
  pathToggleJoinStatusFail,
  pathToggleJoinStatusRequest,
  pathToggleJoinStatusSuccess
} from "./actions";
import { pathsService } from "../../services/paths";
import {
  PATH_PROBLEM_MOVE_REQUEST,
  pathProblemMoveFail,
  PATHS_JOINED_FETCH_SUCCESS
} from "../Paths/actions";
import { notificationShow } from "../Root/actions";

export function* pathProblemOpenHandler(action) {
  const data = yield select(state => ({
    uid: state.firebase.auth.uid,
    joinedPaths: state.paths.joinedPaths
  }));

  if (!data.joinedPaths[action.pathId]) {
    yield put(pathToggleJoinStatusRequest(data.uid, action.pathId, true));
  }
}

export function* pathOpenHandler(action) {
  if (!action.pathId || action.pathId[0] !== "-") {
    return yield Promise.resolve();
  }

  let owner = yield select(
    state =>
      state.paths &&
      state.paths.joinedPaths &&
      state.paths.joinedPaths[action.pathId] &&
      state.paths.joinedPaths[action.pathId].owner
  );
  if (!owner) {
    yield take(PATHS_JOINED_FETCH_SUCCESS);
    owner = yield select(
      state =>
        state.paths &&
        state.paths.joinedPaths &&
        state.paths.joinedPaths[action.pathId] &&
        state.paths.joinedPaths[action.pathId].owner
    );
  }
  // FIXIT: join in previous select
  const uid = yield select(state => state.firebase.auth.uid);
  const problems = yield call(
    [pathsService, pathsService.fetchProblems],
    owner,
    action.pathId
  );

  const solutions = yield call(
    [pathsService, pathsService.fetchProblemsSolutions],
    uid,
    problems
  );

  yield put(pathFetchProblemsSolutionsSuccess(action.pathId, solutions));
}

export function* pathToggleJoinStatusRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    const path = yield call(
      pathsService.togglePathJoinStatus,
      uid,
      action.pathId,
      action.status
    );
    yield put(
      pathToggleJoinStatusSuccess(action.pathId, action.status && path)
    );
  } catch (err) {
    yield put(
      pathToggleJoinStatusFail(action.pathId, action.status, err.message)
    );
  }
}

export function* pathProblemMoveRequestHandler(action) {
  try {
  } catch (err) {
    yield put(
      pathProblemMoveFail(
        action.pathId,
        action.problemId,
        action.direction,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* pathMoreProblemsRequestHandler(action) {
  try {
    yield call(
      pathsService.storeMoreProblemsRequest,
      action.userId,
      action.pathId,
      action.activityCount
    );
    yield put(
      pathMoreProblemsSuccess(
        action.userId,
        action.pathId,
        action.activityCount
      )
    );
  } catch (err) {
    yield put(
      pathMoreProblemsFail(
        action.userId,
        action.pathId,
        action.activityCount,
        err.message
      )
    );
  }
}

export default [
  function* watchPathOpenRequest() {
    yield takeLatest(PATH_OPEN, pathOpenHandler);
  },
  function* watchPathProblemOpen() {
    yield takeLatest(PATH_PROBLEM_OPEN, pathProblemOpenHandler);
  },
  function* watchPathToggleJoinStatusRequest() {
    yield takeLatest(
      PATH_TOGGLE_JOIN_STATUS_REQUEST,
      pathToggleJoinStatusRequestHandler
    );
  },
  function* watchPathProblemMoveRequestHandler() {
    yield takeLatest(PATH_PROBLEM_MOVE_REQUEST, pathProblemMoveRequestHandler);
  },
  function* watchPathMoreProblemsRequest() {
    yield takeLatest(
      PATH_MORE_PROBLEMS_REQUEST,
      pathMoreProblemsRequestHandler
    );
  }
];
