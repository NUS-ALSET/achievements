import { call, put, select, take, takeLatest } from "redux-saga/effects";
import { PATH_OPEN, pathFetchProblemsSolutionsSuccess } from "./actions";
import { pathsService } from "../../services/paths";
import { PATHS_JOINED_FETCH_SUCCESS } from "../Paths/actions";

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

export default [
  function* watchPathOpenRequest() {
    yield takeLatest(PATH_OPEN, pathOpenHandler);
  }
];
