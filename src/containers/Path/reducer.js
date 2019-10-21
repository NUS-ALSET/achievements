import {
  PATH_ADD_COLLABORATOR_SUCCESS,
  CLOSE_ACTIVITY_DIALOG,
  PATH_COLLABORATORS_FETCH_SUCCESS,
  PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS,
  PATH_OPEN_SOLUTION_DIALOG,
  PATH_REMOVE_COLLABORATOR_SUCCESS,
  PATH_SHOW_COLLABORATORS_DIALOG,
  PATH_RUN_STATS_DIALOG,
  FETCH_GITHUB_FILES_LOADING,
  FETCH_GITHUB_FILES_ERROR,
  FETCH_GITHUB_FILES_SUCCESS,
  PATH_ACTIVITY_CODECOMBAT_OPEN,
  PATH_ACTIVITY_CODECOMBAT_DIALOG_SHOW,
  PATH_PROFILE_DIALOG_SHOW,
  FETCH_MY_PATHS_ACTIVITIES,
  PATH_CLOSE,
  UPDATE_PROBLEM_IN_UI,
  ADD_NEW_FILE,
  UPDATE_JEST_FILES,
  REMOVE_JEST_FILE
} from "./actions";
import { PATH_ACTIVITY_DIALOG_SHOW } from "../Paths/actions";
import { ASSIGNMENT_ASSISTANT_FOUND } from "../Assignments/actions";
import {
  EXTERNAL_PROFILE_REFRESH_REQUEST,
  EXTERNAL_PROFILE_UPDATE_FAIL,
  EXTERNAL_PROFILE_UPDATE_SUCCESS,
  INSPECT_PATH_AS_USER,
  EXTERNAL_PROFILE_REFRESH_FAIL
} from "../Account/actions";
import {
  PROBLEM_SOLUTION_SUBMIT_FAIL,
  PROBLEM_SOLUTION_SUBMIT_SUCCESS
} from "../Activity/actions";

export const path = (
  state = {
    problemSolutions: {},
    ui: {
      inspectedUser: "",
      dialog: {
        type: ""
      },
      fetchGithubFilesStatus: ""
    }
  },
  action
) => {
  switch (action.type) {
    case PATH_CLOSE:
      return {
        ...state,
        ui: {
          ...state.ui,
          inspectedUser: ""
        }
      };
    case INSPECT_PATH_AS_USER:
      return {
        ...state,
        ui: {
          ...state.ui,
          inspectedUser: action.userId
        }
      };
    case CLOSE_ACTIVITY_DIALOG:
      return {
        ...state,
        ui: {
          dialog: {
            ...state.ui.dialog,
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
    case PATH_PROFILE_DIALOG_SHOW:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "Profile"
          }
        }
      };
    case EXTERNAL_PROFILE_UPDATE_SUCCESS:
    case EXTERNAL_PROFILE_UPDATE_FAIL:
      return {
        ...state,
        ui: {
          ...state.ui,
          pendingProfileUpdate: false
        }
      };
    case EXTERNAL_PROFILE_REFRESH_REQUEST:
      return {
        ...state,
        ui: {
          ...state.ui,
          pendingProfileUpdate: true
        }
      };
    case PROBLEM_SOLUTION_SUBMIT_SUCCESS:
    case PROBLEM_SOLUTION_SUBMIT_FAIL:
    case EXTERNAL_PROFILE_REFRESH_FAIL:
      return {
        ...state,
        ui: {
          ...state.ui,
          pendingActivityId: ""
        }
      };
    case PATH_ACTIVITY_DIALOG_SHOW:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "ProblemChange",
            value: action.activityInfo
          },
          fetchGithubFilesStatus: ""
        }
      };
    case PATH_ACTIVITY_CODECOMBAT_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          pendingActivityId: action.activityId
        }
      };
    case PATH_ACTIVITY_CODECOMBAT_DIALOG_SHOW: {
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "FetchCodeCombatLevel"
          }
        }
      };
    }
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
            type: "CollaboratorsControl",
            assistants: false
          }
        }
      };
    case PATH_RUN_STATS_DIALOG:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "PathStats",
            assistants: false
          }
        }
      };
    case FETCH_GITHUB_FILES_LOADING: {
      let dialog = state.ui.dialog || {};
      dialog = {
        ...dialog,
        value: {
          ...(dialog.value || {}),
          files: []
        }
      };
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog,
          fetchGithubFilesStatus: "LOADING"
        }
      };
    }
    case FETCH_GITHUB_FILES_SUCCESS: {
      let dialog = state.ui.dialog || {};
      dialog = {
        ...dialog,
        value: {
          ...(dialog.value || {}),
          files: action.data.files
        }
      };
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog,
          fetchGithubFilesStatus: "SUCCESS"
        }
      };
    }
    case FETCH_GITHUB_FILES_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          fetchGithubFilesStatus: "ERROR"
        }
      };
    case FETCH_MY_PATHS_ACTIVITIES:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            pathsInfo: action.pathsInfo
          }
        }
      };
    case UPDATE_PROBLEM_IN_UI:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            value: {
              ...state.ui.dialog.value,
              files: [...action.files]
            }
          }
        }
      }
    case ADD_NEW_FILE: {
      const fileArray = [...state.ui.dialog.value.files];
      fileArray.unshift({
        code: "",
        path: action.name,
        readOnly: false,
        type: "file"
      })

      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            value: {
              ...state.ui.dialog.value,
              files: fileArray
            }
          }
        }
      }
    }
    case REMOVE_JEST_FILE:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            value: {
              ...state.ui.dialog.value,
              files: state.ui.dialog.value.files.filter(f => f.path !== action.file.path)
            }
          }
        }
      }
    case UPDATE_JEST_FILES:
      return {
        ...state,
        ui: {
          ...state.ui,
          dialog: {
            type: "ProblemChange",
            value: {
              ...state.ui.dialog.value,
              files: action.files
            }
          },
          fetchGithubFilesStatus: ""
        }
      }
    default:
      return state;
  }
};
