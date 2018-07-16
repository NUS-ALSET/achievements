import {
  PATH_CLOSE_DIALOG,
  PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS,
  PATH_OPEN_SOLUTION_DIALOG
} from "./actions";
import { PATH_PROBLEM_DIALOG_SHOW } from "../Paths/actions";

export const path = (
  state = {
    problemSolutions: {},
    ui: {
      dialog: {
        type: ""
      }
    }
  },
  action
) => {
  switch (action.type) {
    case PATH_CLOSE_DIALOG:
      return {
        ...state,
        ui: {
          dialog: {
            type: ""
          }
        }
      };
    case PATH_OPEN_SOLUTION_DIALOG:
      return {
        ...state,
        ui: {
          dialog: {
            type: action.problemInfo.type + "Solution",
            value: action.problemInfo
          }
        }
      };
    case PATH_PROBLEM_DIALOG_SHOW:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "ProblemChange",
            value: action.problemInfo
          }
        }
      };
    case PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS:
      return {
        ...state,
        problemSolutions: Object.assign(
          {},
          state.problemSolutions,
          action.solutions
        )
      };
    default:
      return state;
  }
};
