import {
  ACCOUNT_CHANGE_ADMIN_STATUS,
  ACCOUNT_FETCH_PATHS,
  DISPLAY_NAME_EDIT_TOGGLE,
  EXTERNAL_PROFILE_DIALOG_HIDE,
  EXTERNAL_PROFILE_DIALOG_SHOW,
  EXTERNAL_PROFILE_REFRESH_FAIL,
  EXTERNAL_PROFILE_REFRESH_REQUEST,
  EXTERNAL_PROFILE_REFRESH_SUCCESS,
  EXTERNAL_PROFILE_REMOVE_DIALOG_HIDE,
  EXTERNAL_PROFILE_REMOVE_DIALOG_SHOW,
  EXTERNAL_PROFILE_UPDATE_FAIL,
  EXTERNAL_PROFILE_UPDATE_REQUEST,
  EXTERNAL_PROFILE_UPDATE_SUCCESS,
  FETCH_USER_DATA_SUCCESS
} from "./actions";

export const account = (
  state = {
    achievementsRefreshingInProgress: false,
    externalProfileInUpdate: false,
    displayNameEdit: false,
    isAdmin: false,
    joinedPaths: {},
    showExternalProfileDialog: false,
    showRemoveExternalProfileDialog: false,
    removingProfileId: "",
    removingProfileType: "",
    userData: {}
  },
  action
) => {
  switch (action.type) {
    case ACCOUNT_CHANGE_ADMIN_STATUS:
      return {
        ...state,
        isAdmin: action.adminStatus
      };
    case ACCOUNT_FETCH_PATHS:
      return {
        ...state,
        joinedPaths: {
          ...state.joinedPaths,
          [action.accountId]: action.paths
        }
      };
    case EXTERNAL_PROFILE_DIALOG_SHOW:
      return {
        ...state,
        showExternalProfileDialog: true,
        selectedExternalProfileType : action.externalProfile.id
      };
    case EXTERNAL_PROFILE_DIALOG_HIDE:
      return {
        ...state,
        showExternalProfileDialog: false
      };
    case EXTERNAL_PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        externalProfileInUpdate: true
      };
    case EXTERNAL_PROFILE_UPDATE_SUCCESS:
    case EXTERNAL_PROFILE_UPDATE_FAIL:
      return {
        ...state,
        externalProfileInUpdate: false
      };
    case EXTERNAL_PROFILE_REFRESH_REQUEST:
      return {
        ...state,
        achievementsRefreshingInProgress: true,
        selectedExternalProfileType: action.externalProfileType
      };
    case EXTERNAL_PROFILE_REFRESH_SUCCESS:
    case EXTERNAL_PROFILE_REFRESH_FAIL:
      return {
        ...state,
        achievementsRefreshingInProgress: false
      };
    case EXTERNAL_PROFILE_REMOVE_DIALOG_SHOW:
      return {
        ...state,
        showRemoveExternalProfileDialog: true,
        removingProfileId: action.externalProfileId,
        removingProfileType: action.externalProfileType
      };
    case EXTERNAL_PROFILE_REMOVE_DIALOG_HIDE:
      return {
        ...state,
        showRemoveExternalProfileDialog: false
      };
    case DISPLAY_NAME_EDIT_TOGGLE:
      return {
        ...state,
        displayNameEdit: action.status
      };
    case FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        userData: action.data
      }
    default:
      return state;
  }
};
