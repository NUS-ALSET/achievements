import { PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS } from "./actions";

export const path = (
  state = {
    problemSolutions: {}
  },
  action
) => {
  switch (action.type) {
    case PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS:
      return {
        ...state,
        problemSolutions: action.solutions
      };
    default:
      return state;
  }
};
