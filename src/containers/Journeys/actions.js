export const JOURNEYS_OPEN = "JOURNEYS_OPEN";
export const journeysOpen = () => ({
  type: JOURNEYS_OPEN
});

export const JOURNEYS_PATHS_LOADED = "JOURNEYS_PATHS_LOADED";
export const journeysPathsLoaded = paths => ({
  type: JOURNEYS_PATHS_LOADED,
  paths
});

export const JOURNEY_ACTIVITIES_FETCH_REQUEST =
  "JOURNEY_ACTIVITIES_FETCH_REQUEST";
export const journeyActivitiesFetchRequest = journeyId => ({
  type: JOURNEY_ACTIVITIES_FETCH_REQUEST,
  journeyId
});

export const JOURNEY_ACTIVITIES_FETCH_SUCCESS =
  "JOURNEY_ACTIVITIES_FETCH_SUCCESS";
export const journeyActivitiesFetchSuccess = (journeyId, activities) => ({
  type: JOURNEY_ACTIVITIES_FETCH_SUCCESS,
  journeyId,
  activities
});

export const JOURNEY_ACTIVITIES_FETCH_FAIL = "JOURNEY_ACTIVITIES_FETCH_FAIL";
export const journeyActivitiesFetchFail = (journeyId, reason) => ({
  type: JOURNEY_ACTIVITIES_FETCH_FAIL,
  journeyId,
  reason
});

export const JOURNEY_PATH_ACTIVITIES_FETCH_REQUEST =
  "JOURNEY_PATH_ACTIVITIES_FETCH_REQUEST";
export const journeyPathActivitiesFetchRequest = pathId => ({
  type: JOURNEY_PATH_ACTIVITIES_FETCH_REQUEST,
  pathId
});

export const JOURNEY_PATH_ACTIVITIES_FETCH_SUCCESS =
  "JOURNEY_PATH_ACTIVITIES_FETCH_SUCCESS";
export const journeyPathActivitiesFetchSuccess = (pathId, activities) => ({
  type: JOURNEY_PATH_ACTIVITIES_FETCH_SUCCESS,
  pathId,
  activities
});

export const JOURNEY_PATH_ACTIVITIES_FETCH_FAIL =
  "JOURNEY_PATH_ACTIVITIES_FETCH_FAIL";
export const journeyPathActivitiesFetchFail = (pathId, reason) => ({
  type: JOURNEY_PATH_ACTIVITIES_FETCH_FAIL,
  pathId,
  reason
});

export const JOURNEY_SHOW_DIALOG = "JOURNEY_SHOW_DIALOG";
export const journeyShowDialog = (dialogType, data) => ({
  type: JOURNEY_SHOW_DIALOG,
  dialogType,
  data
});

export const JOURNEY_DIALOG_CLOSE = "JOURNEY_DIALOG_CLOSE";
export const journeyDialogClose = () => ({
  type: JOURNEY_DIALOG_CLOSE
});

export const JOURNEY_DELETE_CONFIRMATION_REQUEST =
  "JOURNEY_DELETE_CONFIRMATION_REQUEST";
export const journeyDeleteConfirmationRequest = id => ({
  type: JOURNEY_DELETE_CONFIRMATION_REQUEST,
  id
});

export const JOURNEY_CHANGES_CANCEL = "JOURNEY_CHANGES_CANCEL";
export const journeyChangesCancel = journeyId => ({
  type: JOURNEY_CHANGES_CANCEL,
  journeyId
});

export const JOURNEY_UPSERT_REQUEST = "JOURNEY_UPSERT_REQUEST";
export const journeyUpsertRequest = journeyId => ({
  type: JOURNEY_UPSERT_REQUEST,
  journeyId
});

export const JOURNEY_UPSERT_FAIL = "JOURNEY_UPSERT_FAIL";
export const journeyUpsertFail = (journeyId, reason) => ({
  type: JOURNEY_UPSERT_FAIL,
  journeyId,
  reason
});

export const JOURNEY_UPSERT_SUCCESS = "JOURNEY_UPSERT_SUCCESS";
export const journeyUpsertSuccess = journeyId => ({
  type: JOURNEY_UPSERT_SUCCESS,
  journeyId
});

export const JOURNEY_DATA_UPDATE = "JOURNEY_DATA_UPDATE";
export const journeyDataUpdate = (id, changes) => ({
  type: JOURNEY_DATA_UPDATE,
  id,
  changes
});

export const JOURNEY_DELETE_REQUEST = "JOURNEY_DELETE_REQUEST";
export const journeyDeleteRequest = id => ({
  type: JOURNEY_DELETE_REQUEST,
  id
});

export const JOURNEY_DELETE_SUCCESS = "JOURNEY_DELETE_SUCCESS";
export const journeyDeleteSuccess = id => ({
  type: JOURNEY_DELETE_SUCCESS,
  id
});

export const JOURNEY_DELETE_FAIL = "JOURNEY_DELETE_FAIL";
export const journeyDeleteFail = (id, reason) => ({
  type: JOURNEY_DELETE_FAIL,
  id,
  reason
});

export const JOURNEY_ADD_ACTIVITIES_REQUEST = "JOURNEY_ADD_ACTIVITIES_REQUEST";
export const journeyAddActivitiesRequest = (journeyId, activities) => ({
  type: JOURNEY_ADD_ACTIVITIES_REQUEST,
  journeyId,
  activities
});

export const JOURNEY_ADD_ACTIVITIES_SUCCESS = "JOURNEY_ADD_ACTIVITIES_SUCCESS";
export const journeyAddActivitiesSuccess = (journeyId, activities) => ({
  type: JOURNEY_ADD_ACTIVITIES_SUCCESS,
  journeyId,
  activities
});

export const JOURNEY_ADD_ACTIVITIES_FAIL = "JOURNEY_ADD_ACTIVITIES_FAIL";
export const journeyAddActivitiesFail = (journeyId, reason) => ({
  type: JOURNEY_ADD_ACTIVITIES_FAIL,
  journeyId,
  reason
});

export const JOURNEY_DELETE_ACTIVITY_REQUEST =
  "JOURNEY_DELETE_ACTIVITY_REQUEST";
export const journeyDeleteActivityRequest = (journeyId, activityId) => ({
  type: JOURNEY_DELETE_ACTIVITY_REQUEST,
  journeyId,
  activityId
});

export const JOURNEY_DELETE_ACTIVITY_SUCCESS =
  "JOURNEY_DELETE_ACTIVITY_SUCCESS";
export const journeyDeleteActivitySuccess = (journeyId, activityId) => ({
  type: JOURNEY_DELETE_ACTIVITY_SUCCESS,
  journeyId,
  activityId
});

export const JOURNEY_DELETE_ACTIVITY_FAIL = "JOURNEY_DELETE_ACTIVITY_FAIL";
export const journeyDeleteActivityFail = (journeyId, activityId, reason) => ({
  type: JOURNEY_DELETE_ACTIVITY_FAIL,
  journeyId,
  activityId,
  reason
});

export const JOURNEY_MOVE_ACTIVITY_REQUEST = "JOURNEY_MOVE_ACTIVITY_REQUEST";
export const journeyMoveActivityRequest = (
  journeyId,
  activityId,
  direction
) => ({
  type: JOURNEY_MOVE_ACTIVITY_REQUEST,
  journeyId,
  activityId,
  direction
});

export const JOURNEY_MOVE_ACTIVITY_SUCCESS = "JOURNEY_MOVE_ACTIVITY_SUCCESS";
export const journeyMoveActivitySuccess = (
  journeyId,
  activityId,
  direction
) => ({
  type: JOURNEY_MOVE_ACTIVITY_SUCCESS,
  journeyId,
  activityId,
  direction
});

export const JOURNEY_MOVE_ACTIVITY_FAIL = "JOURNEY_MOVE_ACTIVITY_FAIL";
export const journeyMoveActivityFail = (
  journeyId,
  activityId,
  direction,
  reason
) => ({
  type: JOURNEY_MOVE_ACTIVITY_FAIL,
  journeyId,
  activityId,
  direction,
  reason
});
