import { call, put, race, select, take, takeLatest } from "redux-saga/effects";
import firebase from "firebase/app";
import {
  PATH_ADD_COLLABORATOR_REQUEST,
  PATH_MORE_PROBLEMS_REQUEST,
  PATH_OPEN,
  PATH_ACTIVITY_OPEN,
  PATH_REFRESH_SOLUTIONS_REQUEST,
  PATH_REMOVE_COLLABORATOR_REQUEST,
  PATH_SHOW_COLLABORATORS_DIALOG,
  PATH_RUN_STATS_DIALOG,
  PATH_TOGGLE_JOIN_STATUS_REQUEST,
  FETCH_GITHUB_FILES,
  pathAddCollaboratorFail,
  pathAddCollaboratorSuccess,
  pathCollaboratorsFetchSuccess,
  pathRunStatsInitiated,
  pathMoreProblemsFail,
  pathMoreProblemsSuccess,
  pathRefreshSolutionsFail,
  pathRefreshSolutionsSuccess,
  pathRemoveCollaboratorFail,
  pathRemoveCollaboratorSuccess,
  pathToggleJoinStatusFail,
  pathToggleJoinStatusRequest,
  pathToggleJoinStatusSuccess,
  fetchGithubFilesLoading,
  fetchGithubFilesError,
  PATH_ACTIVITY_CODECOMBAT_OPEN,
  pathActivityCodeCombatDialogShow,
  pathProfileDialogShow,
  CLOSE_ACTIVITY_DIALOG,
  closeActivityDialog,
  PATH_OPEN_JEST_SOLUTION_DIALOG,
  pathOpenSolutionDialog,
  PATH_OPEN_SOLUTION_DIALOG,
  fetchMyPathsActivities,
  SAVE_PROBLEM_TO_DB,
  saveProblemToDBSuccess,
  saveProblemToDBFailure,
  updateProblemInUI,
  updateJestFiles
} from "./actions";
import { ACTIVITY_TYPES, pathsService } from "../../services/paths";
import {
  PATH_ACTIVITY_DELETE_REQUEST,
  PATH_ACTIVITY_MOVE_REQUEST,
  pathActivityDeleteFail,
  pathActivityDeleteSuccess,
  pathActivityMoveFail,
  pathActivityMoveSuccess,
  PATHS_JOINED_FETCH_SUCCESS,
  PATH_ACTIVITY_DIALOG_SHOW
} from "../Paths/actions";
import { notificationShow } from "../Root/actions";
import { codeCombatProfileSelector, pathActivitiesSelector } from "./selectors";
import {
  EXTERNAL_PROFILE_REFRESH_FAIL,
  EXTERNAL_PROFILE_REFRESH_SUCCESS,
  externalProfileRefreshRequest
} from "../Account/actions";
import {
  problemSolutionSubmitFail,
  problemSolutionSubmitSuccess,
  problemSolutionAttemptRequest
} from "../Activity/actions";
import { accountService } from "../../services/account";

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
    yield put(
      pathActivityMoveSuccess(
        action.pathId,
        action.activityId,
        action.direction
      )
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
    yield call(pathsService.deleteActivity, action.activityId, action.pathId);
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
    yield put(notificationShow("Request has been sent to the path creator"));
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
//Path Stats
export function* pathRunStatsDialogHandler(action) {
  try {
    const pathStats = yield call(
      pathsService.runPathStats,
      action.pathId,
      action.userId
    );
    yield put(pathRunStatsInitiated(action.pathId,action.userId,pathStats));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}
/**
 * Jest Activity Open Action
 */
export function* pathActivityJestOpenHandler(action) {
  const { pathId, activityInfo } = action;
  try {
    let files = [];
    yield firebase
      .ref(`/activityData/${activityInfo.id}`)
      .once("value", snapshot => {
        files = snapshot.val().files;
      });
    if (files.length) {
      activityInfo.files = files;
    }
    yield put(pathOpenSolutionDialog(pathId, activityInfo));
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(
      problemSolutionSubmitFail(
        pathId,
        activityInfo.id,
        "Completed",
        err.message
      )
    );
  }
}
export function* pathActivityCodeCombatOpenHandler(action) {
  try {
    const externalService = action.service || "CodeCombat";
    const data = yield select(state => ({
      uid: state.firebase.auth.uid,
      activity: state.firebase.data.activities[action.activityId],
      achievements: state.firebase.data.userAchievements,
      problemOpenTime: state.problem.problemOpenTime
    }));

    if (!action.codeCombatProfile) {
      yield put(pathProfileDialogShow());
    } else {
      yield put(
        externalProfileRefreshRequest(
          action.codeCombatProfile,
          externalService,
          data.uid
        )
      );
    }
    while (true) {
      const result = yield race({
        skip: take(CLOSE_ACTIVITY_DIALOG),
        success: take(EXTERNAL_PROFILE_REFRESH_SUCCESS),
        fail: take(EXTERNAL_PROFILE_REFRESH_FAIL)
      });
      if (result.skip) {
        return;
      }
      if (result.success) {
        // FIXIT: cleanup this
        if (data.activity.type === ACTIVITY_TYPES.profile.id) {
          yield call(
            [pathsService, pathsService.submitSolution],
            data.uid,
            {
              ...data.activity,
              path: action.pathId,
              problemId: action.activityId
            },
            "Completed"
          );
          yield put(
            problemSolutionSubmitSuccess(
              action.pathId,
              action.activityId,
              "Completed"
            )
          );
          yield put(notificationShow("Solution submitted"));
          yield put(closeActivityDialog());
          yield put(
            problemSolutionAttemptRequest(
              action.activityId,
              action.pathId,
              data.activity.type,
              1,
              new Date().getTime(),
              new Date().getTime()
            )
          );
          return;
        }

        const levelsData = yield call(
          accountService.fetchAchievements,
          data.uid,
          externalService
        );

        if (levelsData && levelsData.totalAchievements === -1) {
          throw new Error(`Invalid ${externalService} username provided`);
        }

        if (
          levelsData &&
          levelsData.achievements &&
          ((data.activity.type === ACTIVITY_TYPES.codeCombat.id &&
            levelsData.achievements[data.activity.level] &&
            levelsData.achievements[data.activity.level].complete) ||
            (data.activity.type === ACTIVITY_TYPES.codeCombatNumber.id &&
              levelsData.totalAchievements >= data.activity.count) ||
            (data.activity.type ===
              ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id &&
              levelsData.ladders &&
              (
                levelsData.ladders[
                  `${data.activity.level}-${data.activity.team}`
                ] || {}
              ).percentile >= data.activity.requiredPercentile))
        ) {
          const ladder =
            levelsData.ladders &&
            levelsData.ladders[`${data.activity.level}-${data.activity.team}`];

          yield call(
            [pathsService, pathsService.submitSolution],
            data.uid,
            {
              ...data.activity,
              path: action.pathId,
              problemId: action.activityId
            },
            ladder && {
              rank: ladder.rank,
              numInRanking: ladder.numInRanking,
              value: `${ladder.rank} of ${ladder.numInRanking}`
            }
          );
          yield put(
            problemSolutionSubmitSuccess(
              action.pathId,
              action.activityId,
              "Completed"
            )
          );
          yield put(
            problemSolutionAttemptRequest(
              action.activityId,
              action.pathId,
              data.activity.type,
              1,
              new Date().getTime(),
              new Date().getTime()
            )
          );
          yield put(notificationShow("Solution submitted"));
          yield put(closeActivityDialog());
        } else {
          yield put(
            problemSolutionAttemptRequest(
              action.activityId,
              action.pathId,
              data.activity.type,
              0,
              new Date().getTime(),
              new Date().getTime()
            )
          );
          yield put(
            pathActivityCodeCombatDialogShow(action.pathId, action.activityId)
          );
        }
      }
    }
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(
      problemSolutionSubmitFail(
        action.pathId,
        action.activityId,
        "Completed",
        err.message
      )
    );
  }
}

export function* pathOpenSolutionDialogHandler(action) {
  const problemInfo = action.problemInfo;
  const uid = yield select(state => state.firebase.auth.uid);
  let pathsInfo;

  switch (problemInfo.type) {
    case ACTIVITY_TYPES.creator.id:
    case ACTIVITY_TYPES.educator.id:
      pathsInfo = yield call(pathsService.fetchOwnPaths, uid, {
        withActivities: true
      });

      if (pathsInfo && problemInfo.targetType) {
        let activitiesExist = false;
        for (const pathInfo of pathsInfo) {
          pathInfo.activities = pathInfo.activities.filter(
            activity => activity.type === problemInfo.targetType
          );
          activitiesExist = activitiesExist || pathInfo.activities.length;
        }
        yield put(fetchMyPathsActivities(pathsInfo));
      }
      break;
    default:
  }
}

export function* pathRefreshSolutionsRequestHandler(action) {
  try {
    const data = yield select(state => ({
      uid: state.path.ui.inspectedUser || state.firebase.auth.uid,
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

export function* fetchGithubFilesHandler(action) {
  let data;
  try {
    yield put(fetchGithubFilesLoading());
    data = yield select(state => ({
      uid: state.firebase.auth.uid
    }));
    yield call(
      [pathsService, pathsService.fetchGithubFiles],
      data.uid,
      action.githubURL
    );
  } catch (err) {
    yield put(fetchGithubFilesError());
  }
}

export function* saveFilesToDBHandler(action) {
  try {
    yield put(notificationShow("Saving Problem"));
    yield put(updateProblemInUI(action.files));
    const res = yield call(
      pathsService.saveFiles,
      action.problem,
      action.files
    );
    yield put(saveProblemToDBSuccess(res));
    yield put(notificationShow("Problem Saved"));
  } catch (err) {
    yield put(saveProblemToDBFailure());
    yield put(notificationShow(err.message));
  }
}

export function* insertJestFilesHandler(action) {
  try {
    if (
      action.activityInfo &&
      action.activityInfo.type === "jest" &&
      action.activityInfo.version === 1
    ) {
      const files = yield call(
        pathsService.fetchJestFiles,
        action.activityInfo.id
      );
      yield put(updateJestFiles(files));
    }
  } catch (err) {
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
  function* watchPathRunStatsDialog() {
    yield takeLatest(
      PATH_RUN_STATS_DIALOG,
      pathRunStatsDialogHandler
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
  function* watchPathActivityCodeCombatOpen() {
    yield takeLatest(
      PATH_ACTIVITY_CODECOMBAT_OPEN,
      pathActivityCodeCombatOpenHandler
    );
  },
  function* watchPathOpenSolutionDialog() {
    yield takeLatest(PATH_OPEN_SOLUTION_DIALOG, pathOpenSolutionDialogHandler);
  },

  /**
   * Watch Jest Activity Open Action
   */
  function* watchPathActivityJestOpen() {
    yield takeLatest(
      PATH_OPEN_JEST_SOLUTION_DIALOG,
      pathActivityJestOpenHandler
    );
  },
  function* watchPathRefreshSolutionsRequest() {
    yield takeLatest(
      PATH_REFRESH_SOLUTIONS_REQUEST,
      pathRefreshSolutionsRequestHandler
    );
  },
  function* watchFetchGithubFilesHandler() {
    yield takeLatest(FETCH_GITHUB_FILES, fetchGithubFilesHandler);
  },
  function* watchSaveFilesToDB() {
    yield takeLatest(SAVE_PROBLEM_TO_DB, saveFilesToDBHandler);
  },
  function* watchEditActivity() {
    yield takeLatest(PATH_ACTIVITY_DIALOG_SHOW, insertJestFilesHandler);
  }
];
