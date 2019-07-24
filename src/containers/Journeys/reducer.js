import {
  JOURNEY_SHOW_DIALOG,
  JOURNEY_UPSERT_SUCCESS,
  JOURNEY_DELETE_SUCCESS,
  JOURNEY_DELETE_FAIL,
  JOURNEY_DIALOG_CLOSE,
  JOURNEY_DELETE_CONFIRMATION_REQUEST,
  JOURNEYS_PATHS_LOADED,
  JOURNEY_PATH_ACTIVITIES_FETCH_SUCCESS,
  JOURNEY_ACTIVITIES_FETCH_SUCCESS,
  JOURNEY_MOVE_ACTIVITY_SUCCESS,
  JOURNEY_ADD_ACTIVITIES_SUCCESS,
  JOURNEY_DATA_UPDATE,
  JOURNEY_CHANGES_CANCEL,
  JOURNEY_DELETE_ACTIVITY_REQUEST
} from "./actions";

export const journeys = (
  state = {
    activities: [],
    // Hash map with journey id as index and activities array as values
    journeyActivities: {},
    // Same as journey activities but populated only on activities changes.
    // Required for `cancel` click
    persistendActivities: {},
    changes: {},
    ui: {
      dialog: {}
    },
    paths: {
      myPaths: {},
      publicPaths: {}
    }
  },
  action
) => {
  let targetIndex;
  switch (action.type) {
    case JOURNEY_SHOW_DIALOG:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            type: action.dialogType,
            data: action.data || state.ui.dialog.data
          }
        }
      };
    case JOURNEYS_PATHS_LOADED:
      return {
        ...state,
        paths: action.paths
      };
    case JOURNEY_PATH_ACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        activities: action.activities
      };
    case JOURNEY_CHANGES_CANCEL:
      return {
        ...state,
        changes: {
          ...state.changes,
          [action.journeyId]: false
        },
        journeyActivities: {
          [action.journeyId]: state.persistendActivities[action.journeyId] || []
        }
      };
    case JOURNEY_MOVE_ACTIVITY_SUCCESS:
      targetIndex = state.journeyActivities[action.journeyId].findIndex(
        activity => activity.id === action.activityId
      );
      switch (action.direction) {
        case "down":
          if (
            targetIndex !==
            state.journeyActivities[action.journeyId].length - 1
          ) {
            return {
              ...state,
              changes: {
                [action.journeyId]: state.changes[action.journeyId] || {}
              },
              persistendActivities: {
                [action.journeyId]:
                  state.persistendActivities[action.journeyId] ||
                  state.journeyActivities[action.journeyId] ||
                  []
              },
              journeyActivities: {
                ...state.journeyActivities,
                [action.journeyId]: state.journeyActivities[action.journeyId]
                  .slice(0, targetIndex)
                  .concat(
                    state.journeyActivities[action.journeyId][targetIndex + 1],
                    state.journeyActivities[action.journeyId][targetIndex],
                    ...state.journeyActivities[action.journeyId].slice(
                      targetIndex + 1 + 1
                    )
                  )
              }
            };
          }
          return state;
        case "up":
          if (targetIndex) {
            return {
              ...state,
              changes: {
                [action.journeyId]: state.changes[action.journeyId] || {}
              },
              persistendActivities: {
                [action.journeyId]:
                  state.persistendActivities[action.journeyId] ||
                  state.journeyActivities[action.journeyId] ||
                  []
              },
              journeyActivities: {
                ...state.journeyActivities,
                [action.journeyId]: state.journeyActivities[action.journeyId]
                  .slice(0, targetIndex - 1)
                  .concat(
                    state.journeyActivities[action.journeyId][targetIndex],
                    state.journeyActivities[action.journeyId][targetIndex - 1],
                    ...state.journeyActivities[action.journeyId].slice(
                      targetIndex + 1
                    )
                  )
              }
            };
          }
          return state;
        default:
          return state;
      }
    case JOURNEY_ACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        journeyActivities: {
          ...state.journeyActivities,
          [action.journeyId]: action.activities
        }
      };
    case JOURNEY_ADD_ACTIVITIES_SUCCESS: {
      return {
        ...state,
        changes: {
          [action.journeyId]: state.changes[action.journeyId] || {}
        },
        persistendActivities: {
          [action.journeyId]:
            state.persistendActivities[action.journeyId] ||
            state.journeyActivities[action.journeyId] ||
            []
        },
        journeyActivities: {
          ...state.journeyActivities,
          [action.journeyId]: (
            state.journeyActivities[action.journeyId] || []
          ).concat(action.activities)
        }
      };
    }
    case JOURNEY_DELETE_CONFIRMATION_REQUEST:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            id: action.id,
            type: "DELETE_JOURNEY"
          }
        }
      };
    case JOURNEY_DELETE_ACTIVITY_REQUEST:
      return {
        ...state,
        persistendActivities: {
          [action.journeyId]:
            state.persistendActivities[action.journeyId] ||
            state.journeyActivities[action.journeyId] ||
            []
        },
        changes: {
          [action.journeyId]: state.changes[action.journeyId] || {}
        },
        journeyActivities: {
          [action.journeyId]: (
            state.journeyActivities[action.journeyId] || []
          ).filter(activity => activity.id !== action.activityId)
        }
      };
    case JOURNEY_DIALOG_CLOSE:
    case JOURNEY_DELETE_SUCCESS:
    case JOURNEY_DELETE_FAIL:
    case JOURNEY_UPSERT_SUCCESS:
      return {
        ...state,
        ui: { ...state.ui, dialog: {} }
      };
    case JOURNEY_DATA_UPDATE:
      return {
        ...state,
        changes: {
          ...state.changes,
          [action.id]: {
            ...(state.changes || {}),
            ...action.changes
          }
        }
      };
    default:
      return state;
  }
};
