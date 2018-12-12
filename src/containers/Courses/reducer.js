import {
  COURSE_ASSISTANT_FETCH_SUCCESS,
  COURSE_HIDE_DIALOG,
  COURSE_JOINED_FETCH_SUCCESS,
  COURSE_NEW_DIALOG_CHANGE,
  COURSE_REMOVE_DIALOG_SHOW,
  COURSE_SHOW_NEW_DIALOG,
  COURSE_SWITCH_TAB
} from "./actions";

export const courses = (
  state = {
    assistantCourses: {},
    currentTab: 0,
    dialog: false,
    joinedCourses: {},
    newCourseValues: {
      name: "",
      password: ""
    },
    removingCourse: false,
    fetchedCourses: false
  },
  action
) => {
  switch (action.type) {
    case COURSE_SHOW_NEW_DIALOG:
      return {
        ...state,
        dialog: "NEW_COURSE",
        newCourseValues: {
          id: action.courseData && action.courseData.id,
          name: action.courseData && action.courseData.name,
          password: action.courseData && action.courseData.password,
          description: action.courseData && action.courseData.description
        }
      };
    case COURSE_SWITCH_TAB:
      return {
        ...state,
        currentTab: action.tabIndex
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
    case COURSE_ASSISTANT_FETCH_SUCCESS:
      return {
        ...state,
        assistantCourses: action.courses
      };
    case COURSE_JOINED_FETCH_SUCCESS:
      return {
        ...state,
        joinedCourses: action.courses,
        fetchedCourses: true
      };
    default:
      return state;
  }
};
