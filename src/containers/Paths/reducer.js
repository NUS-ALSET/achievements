import {
  PATH_DIALOG_HIDE,
  PATH_DIALOG_SHOW,
  PATH_PROBLEM_DIALOG_SHOW,
  PATH_SELECT
} from "./actions";

export const paths = (
  state = {
    selectedPathId: "",
    ui: {
      dialog: {
        type: ""
      }
    }
  },
  action
) => {
  switch (action.type) {
    case PATH_DIALOG_SHOW:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "PathChange",
            value: action.pathInfo
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
    case PATH_DIALOG_HIDE:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            type: ""
          }
        }
      };
    case PATH_SELECT:
      return {
        ...state,
        selectedPathId: action.pathId
      };
    default:
      return state;
  }
};
