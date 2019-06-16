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
  JOURNEY_ADD_ACTIVITIES_SUCCESS
} from "./actions";

export const journeys = (
  state = {
    activities: [],
    journeyActivities: {},
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
              changed: true,
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
              changed: true,
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
        changed: true,
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
    case JOURNEY_DIALOG_CLOSE:
    case JOURNEY_DELETE_SUCCESS:
    case JOURNEY_DELETE_FAIL:
    case JOURNEY_UPSERT_SUCCESS:
      return {
        ...state,
        ui: { ...state.ui, dialog: {} }
      };
    default:
      return state;
  }
};
