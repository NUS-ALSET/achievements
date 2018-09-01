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
