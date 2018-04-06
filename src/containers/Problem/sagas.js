import {
  PROBLEM_INIT_REQUEST,
  PROBLEM_SOLUTION_REFRESH_REQUEST,
  PROBLEM_SOLUTION_SUBMIT_REQUEST,
  PROBLEM_SOLVE_UPDATE,
  problemInitFail,
  problemInitSuccess,
  problemSolutionRefreshFail,
  problemSolutionRefreshRequest,
  problemSolutionRefreshSuccess,
  problemSolutionSubmitFail,
  problemSolutionSubmitRequest,
  problemSolutionSubmitSuccess
} from "./actions";
import {
  call,
  put,
  select,
  take,
  takeLatest,
  throttle
} from "redux-saga/effects";
import { pathsService } from "../../services/paths";
import { notificationShow } from "../Root/actions";
import { PATH_GAPI_AUTHORIZED } from "../Paths/actions";
import { APP_SETTING } from "../../achievementsApp/config";

export function* problemInitRequestHandler(action) {
  try {
    let uid = yield select(state => state.firebase.auth.uid);
    if (!uid) {
      yield take("@@reactReduxFirebase/LOGIN");
      uid = yield select(state => state.firebase.auth.uid);
    }

    yield put(problemInitSuccess(action.pathId, action.problemId, null));

    const gapiAuthrozied = yield select(state => state.paths.gapiAuthorized);

    if (!gapiAuthrozied) {
      yield take(PATH_GAPI_AUTHORIZED);
    }

    const pathProblem = yield call(
      [pathsService, pathsService.fetchPathProblem],
      action.pathId,
      action.problemId
    );

    // if (pathProblem) {
    //   yield put(problemSolutionRefreshSuccess(action.problemId,
    //     pathSolution));
    // }

    if (!pathProblem) {
      throw new Error("Missing path problem");
    }

    yield put(problemInitSuccess(action.pathId, action.problemId, pathProblem));

    const solution = yield call(
      [pathsService, pathsService.fetchSolutionFile],
      action.problemId,
      uid
    );
    if (solution) {
      yield put(problemSolutionRefreshSuccess(action.problemId, solution));
    }
  } catch (err) {
    yield put(problemInitFail(action.pathId, action.problemId, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* problemSolveUpdateHandler(action) {
  if (/^http[s]?:\/\/.+/.test(action.fileId)) {
    const fileId = yield call(pathsService.getFileId, action.fileId);

    yield put(
      problemSolutionSubmitRequest(action.pathId, action.problemId, fileId)
    );
    yield put(problemSolutionRefreshRequest(action.problemId, fileId));
  } else {
    yield put(notificationShow("Malformed solution URL"));
  }
}

export function* problemSolutionRefreshRequestHandler(action) {
  const uid = yield select(state => state.firebase.auth.uid);

  try {
    let pathSolution;
    if (action.fileId) {
      pathSolution = {
        json: yield call([pathsService, pathsService.fetchFile], action.fileId),
        id: action.fileId
      };
    } else {
      pathSolution = yield call(
        [pathsService, pathsService.fetchSolutionFile],
        action.problemId,
        uid
      );
    }

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
      pathProblem:
        state.problem.pathProblem || state.assignments.dialog.pathProblem
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
  function* watchProblemSolveUpdate() {
    yield throttle(
      APP_SETTING.defaultThrottle,
      PROBLEM_SOLVE_UPDATE,
      problemSolveUpdateHandler
    );
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
