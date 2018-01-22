import {
  COURSE_HIDE_NEWDIALOG,
  COURSE_NEW_DIALOG_CHANGE,
  COURSE_SHOW_NEW_DIALOG
} from "./actions";

export const courses = (
  state = {
    showNewDialog: false,
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
        showNewDialog: true,
        newCourseValues: {
          name: "",
          password: ""
        }
      };
    case COURSE_HIDE_NEWDIALOG:
      return {
        ...state,
        showNewDialog: false,
        newCourseValues: {
          name: "",
          password: ""
        }
      };
    case COURSE_NEW_DIALOG_CHANGE:
      return {
        ...state,
        newCourseValues: {
          ...state.newCourseValues,
          [action.field]: action.value
        }
      };
    default:
      return state;
  }
};
