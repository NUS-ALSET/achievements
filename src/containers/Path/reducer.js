import {
  PATH_ADD_COLLABORATOR_SUCCESS,
  PATH_CLOSE_DIALOG,
  PATH_COLLABORATORS_FETCH_SUCCESS,
  PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS,
  PATH_OPEN_SOLUTION_DIALOG,
  PATH_REMOVE_COLLABORATOR_SUCCESS,
  PATH_SHOW_COLLABORATORS_DIALOG
} from "./actions";
import { PATH_PROBLEM_DIALOG_SHOW } from "../Paths/actions";
import { ASSIGNMENT_ASSISTANT_FOUND } from "../Assignments/actions";

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
    case PATH_COLLABORATORS_FETCH_SUCCESS:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            assistants: action.assistants
          }
        }
      };
    case ASSIGNMENT_ASSISTANT_FOUND:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            newAssistant: action.assistant
          }
        }
      };
    case PATH_ADD_COLLABORATOR_SUCCESS:
      return {
        ...state,
        ui: {
          dialog: {
            ...state.ui.dialog,
            assistants: [
              ...(state.ui.dialog.assistants || []),
              state.ui.dialog.newAssistant
            ]
          }
        }
      };
    case PATH_REMOVE_COLLABORATOR_SUCCESS:
      return {
        ...state,
        ui: {
          dialog: {
            ...state.ui.dialog,
            assistants: state.ui.dialog.assistants.filter(
              assistant => assistant.id !== action.collaboratorId
            )
          }
        }
      };
    case PATH_SHOW_COLLABORATORS_DIALOG:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "CollaboratorsControl"
          }
        }
      };
    default:
      return state;
  }
};
