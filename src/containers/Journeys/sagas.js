import { takeLatest } from "redux-saga";
import {
  JOURNEY_UPSERT_REQUEST,
  journeyUpsertFail,
  journeyUpsertSuccess,
  JOURNEY_ADD_ACTIVITIES_REQUEST,
  journeyAddActivitiesFail,
  journeyAddActivitiesSuccess,
  JOURNEY_DELETE_ACTIVITY_REQUEST,
  journeyDeleteActivitySuccess,
  journeyDeleteActivityFail,
  JOURNEY_MOVE_ACTIVITY_REQUEST,
  journeyMoveActivitySuccess,
  journeyMoveActivityFail,
  JOURNEYS_OPEN,
  journeysPathsLoaded,
  JOURNEY_PATH_ACTIVITIES_FETCH_REQUEST,
  journeyPathActivitiesFetchSuccess,
  journeyPathActivitiesFetchFail,
  journeyDialogClose,
  journeyActivitiesFetchFail,
  journeyActivitiesFetchSuccess,
  JOURNEY_ACTIVITIES_FETCH_REQUEST
} from "./actions";
import { select, call, put, take } from "redux-saga/effects";
import { journeysService } from "../../services/journeys";
import { notificationShow } from "../Root/actions";
import { pathsService } from "../../services/paths";

export function* journeysOpenHandler() {
  let uid = yield select(state => state.firebase.auth.uid);
  if (!uid) {
    yield take("@@reactReduxFirebase/LOGIN");
    uid = yield select(state => state.firebase.auth.uid);
  }
  const paths = yield call(pathsService.fetchPaths, uid);
  yield put(journeysPathsLoaded(paths));
}

export function* journeyPathActivitiesFetchRequestHandler(action) {
  try {
    const activities = yield call(
      [pathsService, pathsService.fetchProblems],
      "",
      action.pathId
    );
    yield put(journeyPathActivitiesFetchSuccess(action.pathId, activities));
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(journeyPathActivitiesFetchFail(action.pathId, err.message));
  }
}

export function* journeyUpsertRequestHandler(action) {
  const data = yield select(state => ({
    uid: state.firebase.auth.uid
  }));

  try {
    yield call(
      [journeysService, journeysService.setJourney],
      data.uid,
      action.journeyData
    );
    if (action.journeyData.id) {
      yield put(notificationShow("Journey updated"));
    } else {
      yield put(notificationShow("New journey created"));
    }
    yield put(journeyUpsertSuccess(action.journeyData));
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(journeyUpsertFail(action.journeyData, err.message));
  }
}

export function* journeyAddActivitiesRequestHandler(action) {
  try {
    yield call(
      [journeysService, journeysService.addActivities],
      action.journeyId,
      action.activities
    );
    yield put(journeyAddActivitiesSuccess(action.journeyId));
    yield put(journeyDialogClose());
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(journeyAddActivitiesFail(action.journeyId, err.message));
  }
}

export function* journeyDeleteActivityRequestHandler(action) {
  try {
    yield call(
      [journeysService, journeysService.deleteActivity],
      action.journeyId,
      action.activityId
    );
    yield put(
      journeyDeleteActivitySuccess(action.journeyId, action.activityId)
    );
  } catch (err) {
    yield notificationShow(err.message);
    yield put(
      journeyDeleteActivityFail(
        action.journeyId,
        action.activityId,
        err.message
      )
    );
  }
}

export function* journeyMoveActivityRequestHandler(action) {
  try {
    yield call(
      [journeysService, journeysService.moveActivity],
      action.journeyId,
      action.activityId,
      action.direction
    );
    yield put(
      journeyMoveActivitySuccess(
        action.journeyId,
        action.activityId,
        action.direction
      )
    );
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(
      journeyMoveActivityFail(
        action.journeyId,
        action.activityId,
        action.direction,
        err.message
      )
    );
  }
}

export function* journeyActivitiesFetchRequestHandler(action) {
  try {
    const activities = yield call(
      journeysService.fetchJourneyActivities,
      action.journeyId
    );
    yield put(journeyActivitiesFetchSuccess(action.journeyId, activities));
  } catch (err) {
    yield put(notificationShow(err.message));
    yield put(journeyActivitiesFetchFail(action.journeyId, err.message));
  }
}

export default [
  function* watchJourneysOpen() {
    yield takeLatest(JOURNEYS_OPEN, journeysOpenHandler);
  },
  function* watchJourneyPathActivitiesFetchRequest() {
    yield takeLatest(
      JOURNEY_PATH_ACTIVITIES_FETCH_REQUEST,
      journeyPathActivitiesFetchRequestHandler
    );
  },
  function* watchJourneyUpsertRequest() {
    yield takeLatest(JOURNEY_UPSERT_REQUEST, journeyUpsertRequestHandler);
  },
  function* watchJourneyAddActivitiesRequest() {
    yield takeLatest(
      JOURNEY_ADD_ACTIVITIES_REQUEST,
      journeyAddActivitiesRequestHandler
    );
  },
  function* watchJourneyDeleteActivityRequest() {
    yield takeLatest(
      JOURNEY_DELETE_ACTIVITY_REQUEST,
      journeyDeleteActivityRequestHandler
    );
  },
  function* watchJourneyMoveActivityRequest() {
    yield takeLatest(
      JOURNEY_MOVE_ACTIVITY_REQUEST,
      journeyMoveActivityRequestHandler
    );
  },
  function* watchJourneyActivitiesFetchRequest() {
    yield takeLatest(
      JOURNEY_ACTIVITIES_FETCH_REQUEST,
      journeyActivitiesFetchRequestHandler
    );
  }
];
