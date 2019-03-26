import {
  TASKS_LOAD_SUCCESS,
  TASKS_DIALOG_HIDE,
  TASKS_ADD_TASK_DIALOG_SHOW
} from "./actions";

export const tasks = (
  state = {
    tasks: [],
    ui: {
      type: ""
    }
  },
  action
) => {
  switch (action.type) {
    case TASKS_LOAD_SUCCESS:
      return {
        ...state,
        tasks: action.tasks
      };
    case TASKS_ADD_TASK_DIALOG_SHOW:
      return {
        ...state,
        ui: {
          type: "ADD_TASK"
        }
      };
    case TASKS_DIALOG_HIDE:
      return {
        ...state,
        ui: {
          type: ""
        }
      };
    default:
      return state;
  }
};
