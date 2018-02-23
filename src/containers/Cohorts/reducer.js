import {
  ADD_COHORT_DIALOG_HIDE,
  ADD_COHORT_DIALOG_SHOW,
  ADD_COHORT_FAIL,
  ADD_COHORT_SUCCESS,
  COHORTS_CHANGE_TAB
} from "./actions";

export const cohorts = (
  state = {
    currentTab: 0,
    dialog: false
  },
  action
) => {
  switch (action.type) {
    case COHORTS_CHANGE_TAB:
      return {
        ...state,
        currentTab: action.tabIndex
      };
    case ADD_COHORT_DIALOG_SHOW:
      return {
        ...state,
        dialog: {
          type: "addCohort",
          cohort: action.cohort
        }
      };
    case ADD_COHORT_SUCCESS:
    case ADD_COHORT_FAIL:
    case ADD_COHORT_DIALOG_HIDE:
      return {
        ...state,
        dialog: false
      };
    default:
      return state;
  }
};
