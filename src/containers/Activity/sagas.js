/**
 * This module contains sagas for operations on problems.
 * Common workflow of actions:
 * * problemSolutionRefreshRequest
 */

import {
  PROBLEM_CHECK_SOLUTION_REQUEST,
  PROBLEM_INIT_REQUEST,
  PROBLEM_SOLUTION_REFRESH_REQUEST,
  PROBLEM_SOLUTION_SUBMIT_REQUEST,
  PROBLEM_SOLVE_UPDATE,
  problemCheckSolutionFail,
  problemInitFail,
  problemInitSuccess,
  problemSolutionCalculatedWrong,
  problemSolutionProvidedSuccess,
  problemSolutionRefreshFail,
  problemSolutionRefreshRequest,
  problemSolutionRefreshSuccess,
  problemSolutionSubmitFail,
  problemSolutionSubmitSuccess
} from "./actions";
import { delay } from "redux-saga";

import {
  call,
  put,
  race,
  select,
  take,
  takeLatest,
  throttle
} from "redux-saga/effects";
import { pathsService, PROBLEMS_TYPES } from "../../services/paths";
import { notificationShow } from "../Root/actions";
import { PATH_GAPI_AUTHORIZED } from "../Paths/actions";
import { APP_SETTING } from "../../achievementsApp/config";
import { pathFetchProblemsSolutionsSuccess } from "../Path/actions";

const ONE_MINUTE = 60000;

/**
 * This saga executes on open Problem or show AddPathProblemSolutionDialog
 * @param action
 * @returns {IterableIterator<*>}
 */
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

    if (!pathProblem) {
      throw new Error("Missing path activity");
    }

    yield put(problemInitSuccess(action.pathId, action.problemId, pathProblem));

    const solution = yield action.solution &&
    action.solution.originalSolution &&
    action.solution.originalSolution.value
      ? Promise.resolve(
          pathProblem.type === "jupyter"
            ? { id: action.solution.originalSolution.value }
            : action.solution.originalSolution.value
        )
      : call([pathsService, pathsService.fetchSolutionFile], pathProblem, uid);
    yield put(
      problemSolutionRefreshSuccess(action.problemId, solution || false)
    );
  } catch (err) {
    yield put(problemInitFail(action.pathId, action.problemId, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* problemSolveUpdateHandler(action) {
  const fileId = yield call(pathsService.getFileId, action.fileId);

  yield put(problemSolutionRefreshRequest(action.problemId, fileId));
}

export function* problemSolutionRefreshRequestHandler(action) {
  const data = yield select(state => ({
    uid: state.firebase.auth.uid,
    pathProblem: state.problem.pathProblem
  }));

  switch (data.pathProblem.type) {
    case PROBLEMS_TYPES.text.id:
    case PROBLEMS_TYPES.jupyterInline.id:
      if (typeof action.fileId !== "object") {
        return yield put(
          problemSolutionRefreshSuccess(action.problemId, {
            json: data.pathProblem.solutionJSON
          })
        );
      }
      break;
    case "youtube":
      return;
    default:
  }

  try {
    yield put(notificationShow("Fetching your solution"));
    let pathSolution;
    if (action.fileId) {
      pathSolution = {
        json:
          typeof action.fileId === "string"
            ? yield call([pathsService, pathsService.fetchFile], action.fileId)
            : action.fileId,
        id: action.fileId
      };
    } else {
      pathSolution = yield call(
        [pathsService, pathsService.fetchSolutionFile],
        data.pathProblem,
        data.uid
      );
    }

    yield put(
      problemSolutionProvidedSuccess(action.problemId, pathSolution.json)
    );
    yield put(notificationShow("Checking your solution"));

    const { solution, timedOut } = yield race({
      solution: call(
        [pathsService, pathsService.validateSolution],
        data.uid,
        data.pathProblem,
        pathSolution.id,
        pathSolution.json
      ),
      timedOut: delay(ONE_MINUTE)
    });
    if (timedOut) {
      throw new Error("Solution processing timed out");
    }
    if (solution && solution.cells && solution.cells.slice) {
      let solutionFailed = false;

      solution.cells.slice(-data.pathProblem.frozen).forEach(cell => {
        solutionFailed =
          solutionFailed || (!!cell.outputs && cell.outputs.join().trim());
        return true;
      });

      if (solutionFailed) {
        yield put(problemSolutionCalculatedWrong());
        yield put(
          notificationShow(
            "Failing - Your solution did not pass the provided tests."
          )
        );
      } else {
        yield put(notificationShow("Solution is valid"));
      }
    }
    yield put(
      problemSolutionRefreshSuccess(action.problemId, {
        id: pathSolution.id,
        json: solution
      })
    );
  } catch (err) {
    yield put(problemSolutionRefreshFail(action.problemId, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* problemCheckSolutionRequestHandler(action) {
  const data = yield select(state => ({
    uid: state.firebase.auth.uid,
    pathProblem:
      state.problem.pathProblem || state.assignments.dialog.pathProblem
  }));
  try {
    yield put(notificationShow("Checking solution"));
    yield call(
      [pathsService, pathsService.validateSolution],
      data.uid,
      data.pathProblem,
      action.fileId,
      action.solution
    );
    yield put(notificationShow("Solution is valid"));
  } catch (err) {
    yield put(
      problemCheckSolutionFail(
        action.problemId,
        action.fileId,
        action.solution,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* problemSolutionSubmitRequestHandler(action) {
  let data;
  try {
    data = yield select(state => ({
      uid: state.firebase.auth.uid,
      pathProblem:
        state.problem.pathProblem ||
        state.assignments.dialog.pathProblem ||
        action.problemId
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
        data.pathProblem.id,
        action.payload
      )
    );
    yield put(
      pathFetchProblemsSolutionsSuccess(action.pathId, {
        [data.pathProblem.id || data.pathProblem.problemId]: true
      })
    );
    yield put(notificationShow("Solution submitted"));
  } catch (err) {
    yield put(
      problemSolutionSubmitFail(
        action.pathId,
        data.pathProblem.id,
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
  function* watchProblemCheckSolutionRequest() {
    yield takeLatest(
      PROBLEM_CHECK_SOLUTION_REQUEST,
      problemCheckSolutionRequestHandler
    );
  },
  function* watchProblemSolutionSubmitRequest() {
    yield takeLatest(
      PROBLEM_SOLUTION_SUBMIT_REQUEST,
      problemSolutionSubmitRequestHandler
    );
  }
];
