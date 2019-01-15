import {
  CHANGE_PATH_KEY_JUPSOL,
  INIT_ANALYTICSDATA,
  FILTER_ANALYTICSDATA
} from "./actions";

const initialState = {
  jupyterAnalyticsPathKey: "",
  filteredAnalytics: []
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
    default:
      return state;
  }
};
