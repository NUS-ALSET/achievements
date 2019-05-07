import {
  TASK_PRESETS_LOAD_SUCCESS,
  TASK_LOAD_SUCCESS,
  TASK_RUN_SUCCESS,
  TASK_RUN_REQUEST,
  TASK_RUN_FAIL
} from "./actions";

export const task = (
  state = {
    presets: [],
    tasks: {},
    currentResponse: false,
    isRunning: false
  },
  action
) => {
  switch (action.type) {
    case TASK_PRESETS_LOAD_SUCCESS:
      return { ...state, presets: action.presets };
    case TASK_LOAD_SUCCESS:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskInfo.id]: action.taskInfo
        }
      };
    case TASK_RUN_REQUEST:
      return {
        ...state,
        isRunning: true
      };
    case TASK_RUN_SUCCESS:
      return {
        ...state,
        isRunning: false,
        currentResponse: action.response
      };
    case TASK_RUN_FAIL:
      return { ...state, isRunning: false, currentResponse: false };
    default:
      return state;
  }
};
