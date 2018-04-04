import {
  PROBLEM_INIT_SUCCESS,
  PROBLEM_SOLUTION_REFRESH_SUCCESS
} from "./actions";

export const problem = (
  state = {
    problemJSON: false
  },
  action
) => {
  switch (action.type) {
    case PROBLEM_INIT_SUCCESS:
      return {
        ...state,
        pathProblem: action.payload
      };
    case PROBLEM_SOLUTION_REFRESH_SUCCESS:
      return {
        ...state,
        solution: action.payload
      };
    default:
      return state;
  }
};
