import {
  ASSIGNMENTS_SORT_CHANGE,
  ASSIGNMENT_CLOSE_DIALOG,
  ASSIGNMENT_DELETE_REQUEST,
  ASSIGNMENT_SHOW_ADD_DIALOG,
  ASSIGNMENT_SHOW_EDIT_DIALOG,
  ASSIGNMENT_SUBMIT_REQUEST,
  ASSIGNMENT_SWITCH_TAB,
  UPDATE_NEW_ASSIGNMENT_FIELD,
  SET_DEFAULT_ASSIGNMENT_FIELDS,
  ASSIGNMENTS_ASSISTANTS_DIALOG_SHOW,
  ASSIGNMENT_ASSISTANT_FOUND,
  ASSIGNMENT_ADD_ASSISTANT_SUCCESS,
  ASSIGNMENT_REMOVE_ASSISTANT_SUCCESS,
  COURSE_MEMBERS_FETCH_SUCCESS,
  COURSE_ASSIGNMENTS_CLOSE,
  COURSE_MEMBER_ACHIEVEMENTS_REFETCH,
  COURSE_REMOVE_STUDENT_DIALOG_SHOW,
  ASSIGNMENT_PATHS_FETCH_SUCCESS,
  ASSIGNMENT_PROBLEMS_FETCH_SUCCESS,
  ASSIGNMENT_PATH_PROBLEM_FETCH_SUCCESS,
  COURSE_MOVE_STUDENT_DIALOG_SHOW,
  COURSE_MY_COURSES_FETCH_SUCCESS,
  ASSIGNMENT_PATH_PROGRESS_FETCH_SUCCESS,
  ASSIGNMENTS_SHOW_HIDDEN_TOGGLE,
  COURSE_PATHS_FETCH_SUCCESS,
  ENABLE_COMMIT_AFTER_AUTOFILL,
  ASSIGNMENT_TEAM_CHOICE_SOLUTION_SUCCESS
} from "./actions";
import { EXTERNAL_PROFILE_DIALOG_HIDE } from "../Account/actions";
import addDays from "date-fns/add_days";
import format from "date-fns/format";
import {
  PROBLEM_SOLUTION_CALCULATED_WRONG,
  PROBLEM_SOLUTION_PROVIDED_SUCCESS,
  PROBLEM_SOLUTION_REFRESH_FAIL,
  PROBLEM_SOLUTION_REFRESH_REQUEST,
  PROBLEM_SOLUTION_REFRESH_SUCCESS,
  PROBLEM_SOLUTION_EXECUTION_STATUS
} from "../Activity/actions";

const DAYS_IN_WEEK = 7;

export const assignments = (
  state = {
    currentTab: 0,
    dialog: false,
    courseMembers: [],
    showHiddenAssignments: false,
    sort: {
      field: "studentName",
      direction: "asc"
    },
    fieldAutoUpdated: false
  },
  action
) => {
  switch (action.type) {
    case ASSIGNMENTS_SORT_CHANGE:
      return {
        ...state,
        sort: {
          field: action.sortField,
          direction: state.sort.direction === "asc" ? "desc" : "asc"
        }
      };
    case ASSIGNMENT_SUBMIT_REQUEST:
      return {
        ...state,
        dialog: {
          type: action.dialogType,
          value: action.value,
          options: state.dialog.options
        },
        currentAssignment: action.assignment
      };
    case ASSIGNMENT_SWITCH_TAB:
      return {
        ...state,
        currentTab: action.tabIndex
      };
    case ASSIGNMENT_SHOW_ADD_DIALOG:
      return {
        ...state,
        dialog: {
          type: "AddAssignment",
          value: {
            name: "",
            details: "",
            solutionVisible: false,
            visible: false,
            open: format(new Date(), "YYYY-MM-DDTHH:mm"),
            deadline: format(
              addDays(new Date(), DAYS_IN_WEEK),
              "YYYY-MM-DDTHH:mm"
            ),
            questionType: "Text",
            level: "",
            count: 1,
            levels: []
          }
        }
      };
    case ASSIGNMENT_SHOW_EDIT_DIALOG:
      return {
        ...state,
        dialog: {
          type: "AddAssignment",
          value: action.assignment
        }
      };
    case UPDATE_NEW_ASSIGNMENT_FIELD:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          value: {
            ...state.dialog.value,
            [action.field]:
              action.field === "path" && action.value === "default"
                ? ""
                : action.value
          }
        }
      };
    case SET_DEFAULT_ASSIGNMENT_FIELDS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          value: {
            ...state.dialog.value,
            ...action.fields
          }
        }
      };
    case ASSIGNMENT_DELETE_REQUEST:
      return {
        ...state,
        dialog: {
          type: "DeleteAssignment",
          value: action.assignment
        }
      };
    case EXTERNAL_PROFILE_DIALOG_HIDE:
    case ASSIGNMENT_CLOSE_DIALOG:
      return {
        ...state,
        dialog: false
        /*
        // I don't sure that we need other state, so, I'll just remove it
        dialog: {
          ...state.dialog,
          type: ""
        }
        */
      };
    case ASSIGNMENTS_ASSISTANTS_DIALOG_SHOW:
      return {
        ...state,
        dialog: {
          type: "CourseAssistants",
          assistants: action.assistants
        }
      };
    case ASSIGNMENT_ASSISTANT_FOUND:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          newAssistant: action.assistant
        }
      };
    case ASSIGNMENT_ADD_ASSISTANT_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          assistants: [...state.dialog.assistants, state.dialog.newAssistant]
        }
      };
    case ASSIGNMENT_REMOVE_ASSISTANT_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          assistants: state.dialog.assistants.filter(
            assistant => assistant.id !== action.assistantId
          )
        }
      };
    case ASSIGNMENT_PATHS_FETCH_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          paths: action.paths
        }
      };
    case ASSIGNMENT_PROBLEMS_FETCH_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          activities: action.problems
        }
      };
    case ASSIGNMENT_PATH_PROBLEM_FETCH_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          pathProblem: action.pathProblem,
          solution: action.solution
        }
      };
    case ASSIGNMENT_PATH_PROGRESS_FETCH_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          pathProgress: action.pathProgress
        }
      };
    case PROBLEM_SOLUTION_REFRESH_REQUEST:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          solution: {
            ...(state.dialog.solution || {}),
            loading: true,
            failed: false,
            checked: false
          }
        }
      };
    case ASSIGNMENT_TEAM_CHOICE_SOLUTION_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          options: action.options
        }
      };
    case PROBLEM_SOLUTION_REFRESH_FAIL:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          solution: {
            ...(state.dialog.solution || {}),
            checked: false,
            loading: false
          }
        }
      };
    case PROBLEM_SOLUTION_EXECUTION_STATUS: {
      return {
        ...state,
        dialog: {
          ...state.dialog,
          solution: {
            ...(state.dialog.solution || {}),
            ...action.payload
          }
        }
      };
    }
    case PROBLEM_SOLUTION_PROVIDED_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          solution: {
            ...(state.dialog.solution || {}),
            provided: action.payload
          }
        }
      };
    case PROBLEM_SOLUTION_CALCULATED_WRONG:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          solution: {
            ...(state.dialog.solution || {}),
            failed: true
          }
        }
      };
    case PROBLEM_SOLUTION_REFRESH_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          solution: {
            ...(state.dialog.solution || {}),
            ...action.payload,
            checked: true,
            loading: false
          }
        }
      };
    case COURSE_MEMBERS_FETCH_SUCCESS:
      return {
        ...state,
        courseMembers: action.courseMembers
      };
    case COURSE_MEMBER_ACHIEVEMENTS_REFETCH: {
      return {
        ...state,
        courseMembers: state.courseMembers.map(courseMember =>
          courseMember.id === action.studentId
            ? {
                ...courseMember,
                achievements: action.achievements
              }
            : courseMember
        )
      };
    }
    case COURSE_ASSIGNMENTS_CLOSE:
      return {
        ...state,
        courseMembers: []
      };
    case COURSE_PATHS_FETCH_SUCCESS:
      return {
        ...state,
        pathsData: action.paths
      };
    case COURSE_REMOVE_STUDENT_DIALOG_SHOW:
      return {
        ...state,
        dialog: {
          type: "RemoveStudent",
          studentId: action.studentId,
          studentName: action.studentName
        }
      };
    case COURSE_MOVE_STUDENT_DIALOG_SHOW:
      return {
        ...state,
        dialog: {
          type: "MoveStudent",
          course: action.courseId,
          studentId: action.studentId,
          studentName: action.studentName
        }
      };
    case COURSE_MY_COURSES_FETCH_SUCCESS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          courses: action.courses
        }
      };
    case ASSIGNMENTS_SHOW_HIDDEN_TOGGLE:
      return {
        ...state,
        showHiddenAssignments: !state.showHiddenAssignments
      };
    case ENABLE_COMMIT_AFTER_AUTOFILL:
      return {
        ...state,
        fieldAutoUpdated: true
      };
    default:
      return state;
  }
};
