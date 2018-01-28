export const COURSE_PASSWORD_ENTER_REQUEST = "COURSE_PASSWORD_ENTER_REQUEST";
export const coursePasswordEnterRequest = (courseId, password) => ({
  type: COURSE_PASSWORD_ENTER_REQUEST,
  courseId,
  password
});

export const COURSE_PASSWORD_ENTER_SUCCESS = "COURSE_PASSWORD_ENTER_SUCCESS";
export const coursePasswordEnterSuccess = () => ({
  type: COURSE_PASSWORD_ENTER_SUCCESS
});

export const COURSE_PASSWORD_ENTER_FAIL = "COURSE_PASSWORD_ENTER_FAIL";
export const coursePasswordEnterFail = error => ({
  type: COURSE_PASSWORD_ENTER_FAIL,
  error
});

export const ASSIGNMENT_ADD_REQUEST = "ASSIGNMENT_ADD_REQUEST";
export const assignmentAddRequest = () => ({
  type: ASSIGNMENT_ADD_REQUEST
});
