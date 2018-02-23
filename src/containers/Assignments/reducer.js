import {
  ASSIGNMENTS_SORT_CHANGE,
  ASSIGNMENT_CLOSE_DIALOG,
  ASSIGNMENT_DELETE_REQUEST,
  ASSIGNMENT_SHOW_ADD_DIALOG,
  ASSIGNMENT_SHOW_EDIT_DIALOG,
  ASSIGNMENT_SUBMIT_REQUEST,
  ASSIGNMENT_SWITCH_TAB,
  UPDATE_NEW_ASSIGNMENT_FIELD
} from "./actions";
import { EXTERNAL_PROFILE_DIALOG_HIDE } from "../Account/actions";
import addDays from "date-fns/add_days";
import format from "date-fns/format";

const DAYS_IN_WEEK = 7;

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
            [action.field]: action.value
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
        dialog: {
          ...state.dialog,
          type: ""
        }
      };
    default:
      return state;
  }
};
