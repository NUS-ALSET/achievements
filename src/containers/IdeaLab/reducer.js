import {
  CHANGE_PATH_KEY_JUPSOL,
  INIT_ANALYTICSDATA,
  FILTER_ANALYTICSDATA,
  UPDATE_SELECTED_PATH,
  FETCH_ACTIVITY_ATTEMPTS,
  FETCH_ACTIVITY_ATTEMPTS_SUCCESS,
  FETCH_ACTIVITY_ATTEMPTS_FAILURE
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
    case FETCH_ACTIVITY_ATTEMPTS:
      return {
        ...state
      }
    case FETCH_ACTIVITY_ATTEMPTS_SUCCESS:
      return {
        ...state,
        attempts: action.data
      }
    case FETCH_ACTIVITY_ATTEMPTS_FAILURE:
      return {
        ...state,
        err: action.err,
        attempts: {}
      }
    default:
      return state;
  }
};

export const selectUsers = state => {
  return state.firebase.data.analyticsData;
}

export const selectActivities = state => {
  const completedActivities = state.CRUDdemo.attempts;
  const completedActivitiesKeys = Object.keys(completedActivities || {});
  return (completedActivitiesKeys || []).map((el, i) => {
    return { "label": String(i) };
  });
}

export const selectDataset = state => {
  let attempts = state.CRUDdemo.attempts;
  let userObj = {};
  let activities = {};
  const attemptsKeys = Object.keys(attempts || {});
  if (attemptsKeys.length) attemptsKeys.forEach(id => {
    const attempt = attempts[id]
    if (userObj[attempt.userKey]){
        activities[attempt.activityKey] = true;
        userObj[attempt.userKey][attempt.activityKey] = true;
    } else {
        userObj[attempt.userKey] = {
            [attempt.activityKey]:true
        }
    }
  })
  Object.keys(userObj).forEach(userId => {
    userObj[userId] = Object.keys(userObj[userId]).length;
  })
  return {
    usersCompletedActivities : userObj,
    activities
  }
}