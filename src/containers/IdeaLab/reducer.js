import {
  CHANGE_PATH_KEY_JUPSOL,
  INIT_ANALYTICSDATA,
  FILTER_ANALYTICSDATA,
  UPDATE_SELECTED_PATH
} from "./actions";

const initialState = {
  jupyterAnalyticsPathKey: "",
  filteredAnalytics: [],
  selectedPath: ""
};

export const CRUDdemo = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PATH_KEY_JUPSOL:
      return {
        ...state,
        jupyterAnalyticsPathKey: action.pathKey
      };
    case INIT_ANALYTICSDATA:
      return {
        ...state,
        filteredAnalytics: Object.keys(action.analyticsData)
      };
    case FILTER_ANALYTICSDATA:
      return {
        ...state,
        filteredAnalytics: Object.keys(action.analyticsData).filter(
          item => action.analyticsData[item].pathKey === action.pathKey
        )
      };
    case UPDATE_SELECTED_PATH:
      return {
        ...state,
        selectedPath: action.selectedPath
      }
    default:
      return state;
  }
};

export const selectUsers = state => {
  return state.firebase.data.analyticsData;
}