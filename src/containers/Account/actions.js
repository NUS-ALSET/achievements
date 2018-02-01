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
