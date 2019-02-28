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
  selectedPath: {}
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

const dataSource =  {
  "chart": {
    "caption": "Path Analytics",
    "yaxisname": "% of users",
    "subcaption": "How far along a path users are progressing",
    "showhovereffect": "1",
    "numbersuffix": "%",
    "drawcrossline": "1",
    "plottooltext": "<b>$dataValue</b> of users completed in $seriesName",
    // "theme": "fusion"
  },
  "categories": [
    {
      "category": []
    }
  ],
  "dataset":[]
}

const getDifferenceBetweenDates = (date1, date2) => {
  // const days = 7; // Days you want to subtract
  // const today = new Date();
  // const daysAgo = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
    if (date1 && date2) {
      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    }
}

const filterLastXDaysAttempts = (attempts, days) => {
  const today = new Date();
  return Object.keys(attempts).reduce((acc, k) => {
    const attempt = attempts[k];
    const daysDiff = getDifferenceBetweenDates(new Date(attempt.time), today);
    if (+daysDiff <= days) {
      acc[k] = attempt;
    }
    return acc;
  }, {});
}

const createUserObj = attempts => {
  const attemptsKeys = Object.keys(attempts);
  let userObj = {};
  let activities = {};
  if (attemptsKeys.length) attemptsKeys.forEach(id => {
    const attempt = attempts[id]
    if (userObj[attempt.userKey]) {
        activities[attempt.activityKey] = true;
        userObj[attempt.userKey][attempt.activityKey] = true;
    } else {
        userObj[attempt.userKey] = {
            [attempt.activityKey] : true
        }
    }
  })

  Object.keys(userObj).forEach(userId => {
    userObj[userId] = Object.keys(userObj[userId]).length;
  })
  return { activities, userObj }
}

// cocreateLabels =

const createDataSourceForGroup = (attempts) => {
  const pathData = {
    usersCompletedActivities : attempts.userObj,
    activities: attempts.activities
  }
  const { usersCompletedActivities, activities } = pathData;
    const xLabels = Object.keys(activities).map((id, index) => (
      { label: String(index + 1)}
    ));
    const totalUsers = Object.keys(usersCompletedActivities).length;
    const dataSetAll = xLabels.map(ele => {
      const usersCount = Object.keys(usersCompletedActivities)
      .reduce((count, userId) => {
        return usersCompletedActivities[userId] >= Number(ele.label)
        ? ++count
        : count
      }, 0);
      return {
        value : totalUsers > 0 ? (usersCount / totalUsers) * 100 : 0
      }
    });
    return { dataSetAll, xLabels };
}

export const selectDataset = state => {
  let attempts = state.CRUDdemo.attempts || {};
  
  if (Object.keys(attempts).length) {
  const lastSevenDaysAttempts = filterLastXDaysAttempts(attempts, 7);
  const lastFourteenDaysAttempts = filterLastXDaysAttempts(attempts, 14);
  const lastTwentyOneDaysAttempts = filterLastXDaysAttempts(attempts, 21);

  const allAttempts = createUserObj(attempts);
  const sevenDaysAttempts = createUserObj(lastSevenDaysAttempts);
  const fourteenDaysAttempts = createUserObj(lastFourteenDaysAttempts);
  const twentyOneDaysAttempts = createUserObj(lastTwentyOneDaysAttempts);
  

  let dataSourceCopy;
  if (Object.keys(allAttempts.userObj).length) {
    const data = createDataSourceForGroup(allAttempts);
    const lastSevenDaysdata = createDataSourceForGroup(sevenDaysAttempts);
    const lastFourteenDaysdata = createDataSourceForGroup(fourteenDaysAttempts);
    const lastTwentyOneDaysdata = createDataSourceForGroup(twentyOneDaysAttempts);

    dataSourceCopy = JSON.parse(JSON.stringify(dataSource));
    // dataSourceCopy.dataset[0]["data"] = data.dataSetAll;
    dataSourceCopy.dataset.push({
      "seriesname": "All Time",
      "data": data.dataSetAll
    })
    dataSourceCopy.dataset.push({
      "seriesname": "Since 1 weeks ago",
      "data": lastSevenDaysdata.dataSetAll
    })
    dataSourceCopy.dataset.push({
      "seriesname": "Since 2 weeks ago",
      "data": lastFourteenDaysdata.dataSetAll
    })
    dataSourceCopy.dataset.push({
      "seriesname": "Since 3 weeks ago",
      "data": lastTwentyOneDaysdata.dataSetAll
    })
    dataSourceCopy.categories[0]["category"] = data.xLabels;
  }
    return dataSourceCopy;
  } else {
    return dataSource
  }
}