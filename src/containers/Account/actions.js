export const EXTERNAL_PROFILE_DIALOG_SHOW = "EXTERNAL_PROFILE_DIALOG_SHOW";
/**
 * Creates action for external profile dialog show
 *
 * @param {Object} externalProfile
 * @param {String} externalProfile.name
 * @returns {{type: string, externalProfile: *}} action
 */
export const externalProfileDialogShow = externalProfile => ({
  type: EXTERNAL_PROFILE_DIALOG_SHOW,
  externalProfile
});

export const EXTERNAL_PROFILE_DIALOG_HIDE = "EXTERNAL_PROFILE_DIALOG_HIDE";
export const externalProfileDialogHide = () => ({
  type: EXTERNAL_PROFILE_DIALOG_HIDE
});

export const EXTERNAL_PROFILE_UPDATE_REQUEST =
  "EXTERNAL_PROFILE_UPDATE_REQUEST";
export const externalProfileUpdateRequest = (
  externalProfileId,
  externalProfileType
) => ({
  type: EXTERNAL_PROFILE_UPDATE_REQUEST,
  externalProfileId,
  externalProfileType
});

export const EXTERNAL_PROFILE_UPDATE_SUCCESS =
  "EXTERNAL_PROFILE_UPDATE_SUCCESS";
export const externalProfileUpdateSuccess = (
  externalProfileId,
  externalProfileType
) => ({
  type: EXTERNAL_PROFILE_UPDATE_SUCCESS,
  externalProfileId,
  externalProfileType
});

export const EXTERNAL_PROFILE_UPDATE_FAIL = "EXTERNAL_PROFILE_UPDATE_FAIL";
export const externalProfileUpdateFail = (
  externalProfileId,
  externalProfileType
) => ({
  type: EXTERNAL_PROFILE_UPDATE_FAIL,
  externalProfileId,
  externalProfileType
});
