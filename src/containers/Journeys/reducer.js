import {
  JOURNEY_SHOW_DIALOG,
  JOURNEY_UPSERT_SUCCESS,
  JOURNEY_DELETE_SUCCESS,
  JOURNEY_DELETE_FAIL,
  JOURNEY_DIALOG_CLOSE,
  JOURNEY_DELETE_CONFIRMATION_REQUEST,
  JOURNEYS_PATHS_LOADED,
  JOURNEY_PATH_ACTIVITIES_FETCH_SUCCESS,
  JOURNEY_ACTIVITIES_FETCH_SUCCESS
} from "./actions";

export const journeys = (
  state = {
    activities: [],
    journeyActivities: {},
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

    case JOURNEY_ACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        journeyActivities: {
          ...state.journeyActivities,
          [action.journeyId]: action.activities
        }
      };
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
