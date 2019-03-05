export const ADMIN_UPDATE_CONFIG_REQUEST = "ADMIN_UPDATE_CONFIG_REQUEST";
export const adminUpdateConfigRequest = config => ({
  type: ADMIN_UPDATE_CONFIG_REQUEST,
  config
});

export const ADMIN_UPDATE_CONFIG_SUCCESS = "ADMIN_UPDATE_CONFIG_SUCCESS";
export const adminUpdateConfigSuccess = config => ({
  type: ADMIN_UPDATE_CONFIG_SUCCESS,
  config
});

export const ADMIN_UPDATE_CONFIG_FAIL = "ADMIN_UPDATE_CONFIG_FAIL";
export const adminUpdateConfigFail = (config, reason) => ({
  type: ADMIN_UPDATE_CONFIG_FAIL,
  config,
  reason
});

export const CREATE_NEW_SERVICE = "CREATE_NEW_SERVICE";
export const createNewService = data => ({
  type: CREATE_NEW_SERVICE,
  data
})

export const CREATE_NEW_SERVICE_SUCCESS = "CREATE_NEW_SERVICE_SUCCESS";
export const createNewServiceSuccess = () => ({
  type: CREATE_NEW_SERVICE_SUCCESS
})

export const CREATE_NEW_SERVICE_FALIURE = "CREATE_NEW_SERVICE_FALIURE";
export const createNewServiceFaliure = res => ({
  type: CREATE_NEW_SERVICE_FALIURE,
  res
})

export const FETCH_SERVICE_DETAILS = "FETCH_SERVICE_DETAILS";
export const fetchServiceDetails = id => ({
  type: FETCH_SERVICE_DETAILS,
  id
});

export const FETCH_SERVICE_DETAILS_SUCCESS = "FETCH_SERVICE_DETAILS_SUCCESS";
export const fetchServiceDetailsSuccess = service => ({
  type: FETCH_SERVICE_DETAILS_SUCCESS,
  service
})

export const FETCH_SERVICE_DETAILS_FALIURE = "FETCH_SERVICE_DETAILS_FALIURE";
export const fetchServiceDetailsFaliure = err => ({
  type: "FETCH_SERVICE_DETAILS_FALIURE",
  err
})