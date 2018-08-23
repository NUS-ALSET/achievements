import { call, put, select, take, takeLatest } from "redux-saga/effects";
import {
  PATH_ADD_COLLABORATOR_REQUEST,
  PATH_MORE_PROBLEMS_REQUEST,
  PATH_OPEN,
  PATH_ACTIVITY_OPEN,
  PATH_REFRESH_SOLUTIONS_REQUEST,
  PATH_REMOVE_COLLABORATOR_REQUEST,
  PATH_SHOW_COLLABORATORS_DIALOG,
  PATH_TOGGLE_JOIN_STATUS_REQUEST,
  pathAddCollaboratorFail,
  pathAddCollaboratorSuccess,
  pathCollaboratorsFetchSuccess,
  pathMoreProblemsFail,
  pathMoreProblemsSuccess,
  pathRefreshSolutionsFail,
  pathRefreshSolutionsSuccess,
  pathRemoveCollaboratorFail,
  pathRemoveCollaboratorSuccess,
  pathToggleJoinStatusFail,
  pathToggleJoinStatusRequest,
  pathToggleJoinStatusSuccess
} from "./actions";
import { pathsService } from "../../services/paths";
import {
  PATH_ACTIVITY_DELETE_REQUEST,
  PATH_ACTIVITY_MOVE_REQUEST,
  pathActivityDeleteFail,
  pathActivityDeleteSuccess,
  pathActivityMoveFail,
  PATHS_JOINED_FETCH_SUCCESS
} from "../Paths/actions";
import { notificationShow } from "../Root/actions";
import { codeCombatProfileSelector, pathActivitiesSelector } from "./selectors";

export function* pathActivityOpenHandler(action) {
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
    yield select(
      state =>
        state.paths &&
        state.paths.joinedPaths &&
        state.paths.joinedPaths[action.pathId] &&
        state.paths.joinedPaths[action.pathId].owner
    );
  }
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

export function* pathActivityMoveRequestHandler(action) {
  try {
    const data = yield select(state => ({
      uid: state.firebase.auth.uid,
      activities: state.firebase.data.activities || {}
    }));

    const activities = Object.keys(data.activities)
      .map(id => ({ ...data.activities[id], id }))
      .filter(activity => activity.path === action.pathId);

    yield call(
      [pathsService, pathsService.moveActivity],
      data.uid,
      action.pathId,
      activities,
      action.activityId,
      action.direction
    );
  } catch (err) {
    yield put(
      pathActivityMoveFail(
        action.pathId,
        action.activityId,
        action.direction,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* pathActivityDeleteRequestHandler(action) {
  try {
    yield call(pathsService.deleteActivity, action.activityId);
    yield put(pathActivityDeleteSuccess(action.activityId));
  } catch (err) {
    yield put(pathActivityDeleteFail(action.activityId, err.message));
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

/**
 * Note: there is names "collision" - `collaborators` at courses called as
 * `assistants`, so, somewhere I tried to keep consistence, somewhere I lost it
 * @param action
 * @returns {IterableIterator<*>}
 */
export function* pathShowCollaboratorsDialogHandler(action) {
  try {
    const collaborators = yield call(
      pathsService.fetchPathCollaborators,
      action.pathId
    );
    yield put(pathCollaboratorsFetchSuccess(action.pathId, collaborators));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* pathAddCollaboratorRequestHandler(action) {
  try {
    yield call(
      pathsService.updatePathCollaborator,
      action.pathId,
      action.collaboratorId,
      "add"
    );
    yield put(pathAddCollaboratorSuccess(action.pathId, action.collaboratorId));
  } catch (err) {
    yield put(
      pathAddCollaboratorFail(action.pathId, action.collaboratorId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* pathRemoveCollaboratorRequestHandler(action) {
  try {
    yield call(
      pathsService.updatePathCollaborator,
      action.pathId,
      action.collaboratorId,
      "remove"
    );
    yield put(
      pathRemoveCollaboratorSuccess(action.pathId, action.collaboratorId)
    );
  } catch (err) {
    yield put(
      pathRemoveCollaboratorFail(
        action.pathId,
        action.collaboratorId,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* pathRefreshSolutionsRequestHandler(action) {
  try {
    const data = yield select(state => ({
      uid: state.firebase.auth.uid,
      pathActivities: pathActivitiesSelector(state, {
        match: { params: action }
      }),
      profile: codeCombatProfileSelector(state)
    }));

    yield call(
      [pathsService, pathsService.refreshPathSolutions],
      data.uid,
      data.pathActivities,
      data.profile
    );
    yield put(pathRefreshSolutionsSuccess(action.pathId));
  } catch (err) {
    yield put(pathRefreshSolutionsFail(action.pathId, err.message));
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchPathOpenRequest() {
    yield takeLatest(PATH_OPEN, pathOpenHandler);
  },
  function* watchPathProblemOpen() {
    yield takeLatest(PATH_ACTIVITY_OPEN, pathActivityOpenHandler);
  },
  function* watchPathToggleJoinStatusRequest() {
    yield takeLatest(
      PATH_TOGGLE_JOIN_STATUS_REQUEST,
      pathToggleJoinStatusRequestHandler
    );
  },
  function* watchPathActivityMoveRequest() {
    yield takeLatest(
      PATH_ACTIVITY_MOVE_REQUEST,
      pathActivityMoveRequestHandler
    );
  },
  function* watchPathActivityDeleteRequest() {
    yield takeLatest(
      PATH_ACTIVITY_DELETE_REQUEST,
      pathActivityDeleteRequestHandler
    );
  },
  function* watchPathMoreProblemsRequest() {
    yield takeLatest(
      PATH_MORE_PROBLEMS_REQUEST,
      pathMoreProblemsRequestHandler
    );
  },

  function* watchPathShowCollaboratorsDialog() {
    yield takeLatest(
      PATH_SHOW_COLLABORATORS_DIALOG,
      pathShowCollaboratorsDialogHandler
    );
  },
  function* watchPathAddCollaboratorRequest() {
    yield takeLatest(
      PATH_ADD_COLLABORATOR_REQUEST,
      pathAddCollaboratorRequestHandler
    );
  },
  function* watchPathRemoveCollaboratorRequest() {
    yield takeLatest(
      PATH_REMOVE_COLLABORATOR_REQUEST,
      pathRemoveCollaboratorRequestHandler
    );
  },
  function* watchPathRefreshSolutionsRequest() {
    yield takeLatest(
      PATH_REFRESH_SOLUTIONS_REQUEST,
      pathRefreshSolutionsRequestHandler
    );
  }
];
