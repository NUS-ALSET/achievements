import { notificationShow } from "../Root/actions";

const firebase = require("firebase");

export const PATH_OPEN = "PATH_OPEN";
export const pathOpen = pathId => ({
  type: PATH_OPEN,
  pathId
});

// In fact, it only fetches existance of solution, should be renamed?
export const PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS =
  "PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS";
export const pathFetchProblemsSolutionsSuccess = (pathId, solutions) => ({
  type: PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS,
  pathId,
  solutions
});

export const PATH_TOGGLE_JOIN_STATUS_REQUEST =
  "PATH_TOGGLE_JOIN_STATUS_REQUEST";
export const pathToggleJoinStatusRequest = (
  userId,
  pathId,
  status
) => dispatch =>
  firebase
    .database()
    .ref(`/paths/${pathId}`)
    .once("value")
    .then(path =>
      firebase
        .database()
        .ref(`/studentJoinedPaths/${userId}/${pathId}`)
        .set(status)
        .then(() =>
          dispatch(pathToggleJoinStatusSuccess(pathId, status && path.val()))
        )
    )
    .catch(err => {
      dispatch(pathToggleJoinStatusFail(pathId, status, err.message));
      dispatch(notificationShow(err.message));
    });

export const PATH_TOGGLE_JOIN_STATUS_SUCCESS =
  "PATH_TOGGLE_JOIN_STATUS_SUCCESS";
export const pathToggleJoinStatusSuccess = (pathId, status) => ({
  type: PATH_TOGGLE_JOIN_STATUS_SUCCESS,
  pathId,
  status
});

export const PATH_TOGGLE_JOIN_STATUS_FAIL = "PATH_TOGGLE_JOIN_STATUS_FAIL";
export const pathToggleJoinStatusFail = (pathId, status, reason) => ({
  type: PATH_TOGGLE_JOIN_STATUS_FAIL,
  pathId,
  status,
  reason
});
