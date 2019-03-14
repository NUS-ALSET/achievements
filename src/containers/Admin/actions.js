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

export const ADMIN_CUSTOM_AUTH_REQUEST = "ADMIN_CUSTOM_AUTH_REQUEST";
export const adminCustomAuthRequest = uid => ({
  type: ADMIN_CUSTOM_AUTH_REQUEST,
  uid
});

export const CREATE_NEW_SERVICE = "CREATE_NEW_SERVICE";
export const createNewService = data => ({
  type: CREATE_NEW_SERVICE,
  data
});

export const CREATE_NEW_SERVICE_SUCCESS = "CREATE_NEW_SERVICE_SUCCESS";
export const createNewServiceSuccess = () => ({
  type: CREATE_NEW_SERVICE_SUCCESS
});

export const CREATE_NEW_SERVICE_FALIURE = "CREATE_NEW_SERVICE_FALIURE";
export const createNewServiceFaliure = res => ({
  type: CREATE_NEW_SERVICE_FALIURE,
  res
});

export const FETCH_SERVICE_DETAILS = "FETCH_SERVICE_DETAILS";
export const fetchServiceDetails = id => ({
  type: FETCH_SERVICE_DETAILS,
  id
});

export const FETCH_SERVICE_DETAILS_SUCCESS = "FETCH_SERVICE_DETAILS_SUCCESS";
export const fetchServiceDetailsSuccess = service => ({
  type: FETCH_SERVICE_DETAILS_SUCCESS,
  service
});

export const FETCH_SERVICE_DETAILS_FALIURE = "FETCH_SERVICE_DETAILS_FALIURE";
export const fetchServiceDetailsFaliure = err => ({
  type: "FETCH_SERVICE_DETAILS_FALIURE",
  err
});

export const UPDATE_SERVICE_DETAILS = "UPDATE_SERVICE_DETAILS";
export const updateServiceDetails = data => ({
  type: UPDATE_SERVICE_DETAILS,
  data
});

export const UPDATE_SERVICE_DETAILS_SUCCESS = "UPDATE_SERVICE_DETAILS_SUCCESS";
export const updateServiceDetailsSuccess = service => ({
  type: UPDATE_SERVICE_DETAILS_SUCCESS,
  service
});

export const UPDATE_SERVICE_DETAILS_FALIURE = "UPDATE_SERVICE_DETAILS";
export const updateServiceDetailsFaliure = err => ({
  type: UPDATE_SERVICE_DETAILS_FALIURE,
  err
});

export const DELETE_SERVICE = "DELETE_SERVICE";
export const deleteService = id => ({
  type: DELETE_SERVICE,
  id
});

export const DELETE_SERVICE_SUCCESS = "DELETE_SERVICE_SUCCESS";
export const deleteServiceSuccess = res => ({
  type: DELETE_SERVICE_SUCCESS,
  res
});

export const DELETE_SERVICE_FALIURE = "DELETE_SERVICE_FALIURE";
export const deleteServiceFaliure = err => ({
  type: DELETE_SERVICE_FALIURE,
  err
});

export const REMOVE_SERVICE = "UPDATE_SERVICE_VALUE";
export const removeService = () => ({
  type: REMOVE_SERVICE
});

export const TOGGLE_SERVICE = "TOGGLE_SERVICE";
export const toggleService = service => ({
  type: TOGGLE_SERVICE,
  service
});

export const TOGGLE_SERVICE_SUCCESS = "TOGGLE_SERVICE_SUCCESS";
export const toggleServiceSuccess = () => ({
  type: TOGGLE_SERVICE_SUCCESS
});

export const TOGGLE_SERVICE_FALIURE = "TOGGLE_SERVICE_FALIURE";
export const toggleServiceFaliure = () => ({
  type: TOGGLE_SERVICE_FALIURE
});
