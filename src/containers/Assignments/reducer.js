import {
  ASSIGNMENT_CLOSE_DIALOG,
  ASSIGNMENT_DELETE_REQUEST,
  ASSIGNMENT_SUBMIT_REQUEST,
  ASSIGNMENT_SWITCH_TAB,
  ASSIGNMENTS_SORT_CHANGE
} from "./actions";

export const assignments = (
  state = {
    currentTab: 0,
    dialog: false,
    sort: {
      field: "studentName",
      direction: "asc"
    }
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
          value: action.value
        },
        currentAssignment: action.assignment
      };
    case ASSIGNMENT_SWITCH_TAB:
      return {
        ...state,
        currentTab: action.tabIndex
      };
    case ASSIGNMENT_DELETE_REQUEST:
      return {
        ...state,
        dialog: {
          type: "DeleteAssignment",
          value: action.assignment
        }
      };
    case ASSIGNMENT_CLOSE_DIALOG:
      return {
        ...state,
        dialog: false
      };
    default:
      return state;
  }
};
