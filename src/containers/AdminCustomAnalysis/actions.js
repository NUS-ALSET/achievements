export const ADMIN_CUSTOM_ANALYSIS_OPEN = "ADMIN_CUSTOM_ANALYSIS_OPEN";
export const adminCustomAnalysisOpen = isAdmin => ({
  type: ADMIN_CUSTOM_ANALYSIS_OPEN,
  isAdmin
});

export const ADMIN_STATUS_LOADED = "ADMIN_STATUS_LOADED";
export const adminStatusLoaded = isAdmin => ({
  type: ADMIN_STATUS_LOADED,
  isAdmin
});

export const ADMIN_STATUS_ERROR = "ADMIN_STATUS_ERROR";
export const adminStatusError = (isAdmin, error) => ({
  type: ADMIN_STATUS_ERROR,
  isAdmin,
  error
});
