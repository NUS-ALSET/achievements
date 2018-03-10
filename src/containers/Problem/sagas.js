import {
  PROBLEM_INIT_REQUEST,
  PROBLEM_SOLUTION_REFRESH_REQUEST,
  PROBLEM_SOLUTION_SUBMIT_REQUEST,
  PROBLEM_SOLVE_REQUEST,
  problemInitFail,
  problemInitSuccess,
  problemSolutionRefreshFail,
  problemSolutionRefreshRequest,
  problemSolutionRefreshSuccess,
  problemSolutionSubmitFail,
  problemSolutionSubmitSuccess,
  problemSolveFail,
  problemSolveSuccess
} from "./actions";
import { call, put, select, take, takeLatest } from "redux-saga/effects";
import { pathsService } from "../../services/paths";
import { notificationShow } from "../Root/actions";

export function* problemInitRequestHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }

    yield put(problemInitSuccess(action.problemOwner, action.problemId, null));

    const pathProblem = yield call(
      [pathsService, pathsService.fetchPathProblem],
      action.pathId,
      action.problemId
    );
    const pathSolution = yield call(
      [pathsService, pathsService.fetchSolutionFile],
      action.problemId,
      uid
    );

    if (pathSolution) {
      yield put(problemSolutionRefreshSuccess(action.problemId, pathSolution));
    }

    yield put(
      problemInitSuccess(action.problemOwner, action.problemId, pathProblem)
    );
  } catch (err) {
    yield put(
      problemInitFail(action.problemOwner, action.problemId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* problemSolveRequestHandler(action) {
  const data = yield select(state => ({
    uid: state.firebase.auth.uid,
    pathProblem: state.problem.pathProblem
  }));

  try {
    const fileId = yield call(
      [pathsService, pathsService.uploadSolutionFile],
      data.uid,
      action.problemId,
      data.pathProblem.problemJSON
    );
    yield put(problemSolveSuccess(action.problemId, fileId));
    yield put(problemSolutionRefreshRequest(action.problemId));
  } catch (err) {
    yield put(problemSolveFail(action.problemId, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* problemSolutionRefreshRequestHandler(action) {
  const uid = yield select(state => state.firebase.auth.uid);

  try {
    const pathSolution = yield call(
      [pathsService, pathsService.fetchSolutionFile],
      action.problemId,
      uid
    );
    yield put(problemSolutionRefreshSuccess(action.problemId, pathSolution));
  } catch (err) {
    yield put(problemSolutionRefreshFail(action.problemId, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* problemSolutionSubmitRequestHandler(action) {
  try {
    const data = yield select(state => ({
      uid: state.firebase.auth.uid,
      pathProblem: state.problem.pathProblem
    }));
    yield call(
      [pathsService, pathsService.submitSolution],
      data.uid,
      data.pathProblem,
      action.payload
    );
    yield put(
      problemSolutionSubmitSuccess(
        action.pathId,
        action.problemId,
        action.payload
      )
    );
    yield put(notificationShow("Solution is valid!"));
  } catch (err) {
    yield put(
      problemSolutionSubmitFail(
        action.pathId,
        action.problemId,
        action.payload,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchProblemInitRequest() {
    yield takeLatest(PROBLEM_INIT_REQUEST, problemInitRequestHandler);
  },
  function* watchProblemSolveRequest() {
    yield takeLatest(PROBLEM_SOLVE_REQUEST, problemSolveRequestHandler);
  },
  function* watchProblemSolutionRefreshRequest() {
    yield takeLatest(
      PROBLEM_SOLUTION_REFRESH_REQUEST,
      problemSolutionRefreshRequestHandler
    );
  },
  function* watchProblemSolutionSubmitRequest() {
    yield takeLatest(
      PROBLEM_SOLUTION_SUBMIT_REQUEST,
      problemSolutionSubmitRequestHandler
    );
  }
];
