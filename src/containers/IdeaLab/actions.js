export const CHANGE_PATH_KEY_JUPSOL = "CHANGE_PATH_KEY_JUPSOL";
export const INIT_ANALYTICSDATA = "INIT_ANALYTICSDATA";
export const FILTER_ANALYTICSDATA = "FILTER_ANALYTICSDATA";
export const CREATE_TO_CRUD_DEMO = "CREATE_TO_CRUD_DEMO"

export const changePathKeyJupSol = pathKey => ({
  type: CHANGE_PATH_KEY_JUPSOL,
  pathKey
});

export const initAnalyticsData = analyticsData => ({
  type: INIT_ANALYTICSDATA,
  analyticsData
});

export const filterAnalyticsData = (analyticsData, pathKey) => ({
  type: FILTER_ANALYTICSDATA,
  analyticsData,
  pathKey
});

export const createToCRUDdemo = () => ({
  type: CREATE_TO_CRUD_DEMO
})