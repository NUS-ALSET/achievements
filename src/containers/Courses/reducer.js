import {
  COURSE_HIDE_DIALOG,
  COURSE_NEW_DIALOG_CHANGE,
  COURSE_REMOVE_DIALOG_SHOW,
  COURSE_SHOW_NEW_DIALOG
} from "./actions";

export const courses = (
  state = {
    dialog: false,
    removingCourse: false,
    newCourseValues: {
      name: "",
      password: ""
    }
  },
  action
) => {
  switch (action.type) {
    case COURSE_SHOW_NEW_DIALOG:
      return {
        ...state,
        dialog: "NEW_COURSE",
        newCourseValues: {
          name: "",
          password: ""
        }
      };
    case COURSE_HIDE_DIALOG:
      return {
        ...state,
        dialog: false
      };
    case COURSE_NEW_DIALOG_CHANGE:
      return {
        ...state,
        newCourseValues: {
          ...state.newCourseValues,
          [action.field]: action.value
        }
      };
    case COURSE_REMOVE_DIALOG_SHOW:
      return {
        ...state,
        dialog: "REMOVE_COURSE",
        removingCourse: {
          id: action.id,
          name: action.name
        }
      };
    default:
      return state;
  }
};
