import {
  TASKS_DIALOG_HIDE,
  TASKS_DELETE_TASK_DIALOG_SHOW,
  TASKS_DELETE_TASK_SUCCESS
} from "./actions";

export const tasks = (
  state = {
    ui: {
      type: ""
    }
  },
  action
) => {
  switch (action.type) {
    case TASKS_DELETE_TASK_DIALOG_SHOW:
      return {
        ...state,
        ui: {
          dialogType: "DELETE_TASK",
          taskId: action.taskId
        }
      };
    case TASKS_DELETE_TASK_SUCCESS:
      return {
        ...state,
        ui: {
          type: ""
        }
      };
    case TASKS_DIALOG_HIDE:
      return {
        ...state,
        ui: {
          dialogType: ""
        }
      };
    default:
      return state;
  }
};
