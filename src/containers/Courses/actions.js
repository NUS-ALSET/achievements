export const COURSE_SHOW_NEW_DIALOG = "COURSE_SHOW_NEW_DIALOG";
export const courseShowNewDialog = courseData => ({
  type: COURSE_SHOW_NEW_DIALOG,
  courseData
});

export const COURSE_HIDE_DIALOG = "COURSE_HIDE_DIALOG";
export const courseHideDialog = () => ({
  type: COURSE_HIDE_DIALOG
});

export const COURSE_NEW_DIALOG_CHANGE = "COURSE_NEW_DIALOG_CHANGE";
export const courseNewDialogChange = (field, value) => ({
  type: COURSE_NEW_DIALOG_CHANGE,
  field,
  value
});

export const COURSE_NEW_REQUEST = "COURSE_NEW_REQUEST";
export const courseNewRequest = courseData => ({
  type: COURSE_NEW_REQUEST,
  courseData
});

export const COURSE_NEW_SUCCESS = "COURSE_NEW_SUCCESS";
export const courseNewSuccess = (name, key) => ({
  type: COURSE_NEW_SUCCESS,
  name,
  key
});

export const COURSE_NEW_FAIL = "COURSE_NEW_FAIL";
export const courseNewFail = (name, error) => ({
  type: COURSE_NEW_FAIL,
  name,
  error
});

export const COURSE_REMOVE_DIALOG_SHOW = "COURSE_REMOVE_DIALOG_SHOW";
export const courseRemoveDialogShow = (courseId, courseName) => ({
  type: COURSE_REMOVE_DIALOG_SHOW,
  id: courseId,
  name: courseName
});

export const COURSE_REMOVE_REQUEST = "COURSE_REMOVE_REQUEST";
export const courseRemoveRequest = courseId => ({
  type: COURSE_REMOVE_REQUEST,
  courseId
});

export const COURSE_REMOVE_SUCCESS = "COURSE_REMOVE_SUCCESS";
export const courseRemoveSuccess = courseId => ({
  type: COURSE_REMOVE_SUCCESS,
  courseId
});

export const COURSE_REMOVE_FAIL = "COURSE_REMOVE_FAIL";
export const courseRemoveFail = (courseId, error) => ({
  type: COURSE_REMOVE_FAIL,
  error
});

export const COURSE_SWITCH_TAB = "COURSE_SWITCH_TAB";
export const courseSwitchTab = tabIndex => ({
  type: COURSE_SWITCH_TAB,
  tabIndex
});

export const COURSE_JOINED_FETCH_REQUEST = "COURSE_JOINED_FETCH_REQUEST";
export const courseJoinedFetchRequest = courseIds => ({
  type: COURSE_JOINED_FETCH_REQUEST,
  courseIds
});

export const COURSE_JOINED_FETCH_SUCCESS = "COURSE_JOINED_FETCH_SUCCESS";
export const courseJoinedFetchSuccess = courses => ({
  type: COURSE_JOINED_FETCH_SUCCESS,
  courses
});

export const COURSE_ASSISTANT_FETCH_REQUEST = "COURSE_ASSISTANT_FETCH_REQUEST";
export const courseAssistantFetchRequest = () => ({
  type: COURSE_ASSISTANT_FETCH_REQUEST
});

export const COURSE_ASSISTANT_FETCH_SUCCESS = "COURSE_ASSISTANT_FETCH_SUCCESS";
export const courseAssistantFetchSuccess = courses => ({
  type: COURSE_ASSISTANT_FETCH_SUCCESS,
  courses
});
