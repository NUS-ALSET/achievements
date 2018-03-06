import {
  PROBLEM_INIT_SUCCESS,
  PROBLEM_SOLUTION_REFRESH_SUCCESS,
  PROBLEM_SOLVE_SUCCESS
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
    case PROBLEM_SOLVE_SUCCESS:
      return {
        ...state,
        solutionKey: action.solutionKey
      };
    case PROBLEM_SOLUTION_REFRESH_SUCCESS:
      return {
        ...state,
        solutionJSON: action.payload
      };
    default:
      return state;
  }
};
