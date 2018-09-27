import { COHORT_FETCH_SUCCESS } from "./actions";

export const cohort = (state = {}, action) => {
  switch (action.type) {
    case COHORT_FETCH_SUCCESS:
      return {
        ...state,
        cohort: action.cohortData
      };
    default:
      return state;
  }
};
