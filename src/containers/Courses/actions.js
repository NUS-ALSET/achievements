export const COURSE_SHOW_NEW_DIALOG = "COURSE_SHOW_NEW_DIALOG";
export const courseShowNewDialog = () => ({
  type: COURSE_SHOW_NEW_DIALOG
});

export const COURSE_HIDE_NEWDIALOG = "COURSE_HIDE_NEWDIALOG";
export const courseHideNewdialog = () => ({
  type: COURSE_HIDE_NEWDIALOG
});

export const COURSE_NEW_DIALOG_CHANGE = "COURSE_NEW_DIALOG_CHANGE";
export const courseNewDialogChange = (field, value) => ({
  type: COURSE_NEW_DIALOG_CHANGE,
  field,
  value
});

export const COURSE_NEW_REQUEST = "COURSE_NEW_REQUEST";
export const courseNewRequest = (name, password) => ({
  type: COURSE_NEW_REQUEST,
  name,
  password
});

export const COURSE_NEW_SUCCESS = "COURSE_NEW_SUCCESS";
export const courseNewSuccess = (name) => ({
  type: COURSE_NEW_SUCCESS,
  name
});

export const COURSE_NEW_FAIL = "COURSE_NEW_FAIL";
export const courseNewFail = (name, error) => ({
  type: COURSE_NEW_FAIL,
  name,
  error
});
