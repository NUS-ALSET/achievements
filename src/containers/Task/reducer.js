import { TASK_PRESETS_LOAD_SUCCESS, TASK_LOAD_SUCCESS } from "./actions";

export const task = (
  state = {
    presets: [],
    currentTask: false
  },
  action
) => {
  switch (action.type) {
    case TASK_PRESETS_LOAD_SUCCESS:
      return { ...state, presets: action.presets };
    case TASK_LOAD_SUCCESS:
      return { ...state, currentTask: action.taskInfo };
    default:
      return state;
  }
};
