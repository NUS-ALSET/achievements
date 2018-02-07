import {
  ASSIGNMENT_CLOSE_DIALOG,
  ASSIGNMENT_SUBMIT_REQUEST,
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
    case ASSIGNMENT_CLOSE_DIALOG:
      return {
        ...state,
        dialog: false
      };
    default:
      return state;
  }
};
