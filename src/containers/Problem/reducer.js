import { PROBLEM_INIT_SUCCESS } from "./actions";

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
        problemJSON: action.payload
      };
    default:
      return state;
  }
};
