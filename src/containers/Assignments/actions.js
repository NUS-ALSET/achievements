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

export const ASSIGNMENT_SWITCH_TAB = "ASSIGNMENT_SWITCH_TAB";
export const assignmentSwitchTab = tabIndex => ({
  type: ASSIGNMENT_SWITCH_TAB,
  tabIndex
});

export const ASSIGNMENT_SHOW_ADD_DIALOG = "ASSIGNMENT_SHOW_ADD_DIALOG";
export const assignmentShowAddDialog = () => ({
  type: ASSIGNMENT_SHOW_ADD_DIALOG
});

export const UPDATE_NEW_ASSIGNMENT_FIELD = "UPDATE_NEW_ASSIGNMENT_FIELD";
export const updateNewAssignmentField = (field, value) => ({
  type: UPDATE_NEW_ASSIGNMENT_FIELD,
  field,
  value
});

export const ASSIGNMENT_ADD_REQUEST = "ASSIGNMENT_ADD_REQUEST";
export const assignmentAddRequest = (courseId, assignment) => ({
  type: ASSIGNMENT_ADD_REQUEST,
  courseId,
  assignment
});

export const ASSIGNMENT_ADD_SUCCESS = "ASSIGNMENT_ADD_SUCCESS";
export const assignmentAddSuccess = () => ({
  type: ASSIGNMENT_ADD_SUCCESS
});

export const ASSIGNMENT_ADD_FAIL = "ASSIGNMENT_ADD_FAIL";
export const assignmentAddFail = error => ({
  type: ASSIGNMENT_ADD_FAIL,
  error
});

export const ASSIGNMENTS_SORT_CHANGE = "ASSIGNMENTS_SORT_CHANGE";
export const assignmentsSortChange = sortField => ({
  type: ASSIGNMENTS_SORT_CHANGE,
  sortField
});

export const ASSIGNMENT_SUBMIT_REQUEST = "ASSIGNMENT_SUBMIT_REQUEST";
export const assignmentSubmitRequest = (assignment, solution) => ({
  type: ASSIGNMENT_SUBMIT_REQUEST,
  assignment: assignment,
  dialogType: assignment.questionType,
  value: solution
});

export const ASSIGNMENT_SOLUTION_REQUEST = "ASSIGNMENT_SOLUTION_REQUEST";
export const assignmentSolutionRequest = (
  courseId,
  assignmentId,
  solution
) => ({
  type: ASSIGNMENT_SOLUTION_REQUEST,
  courseId,
  assignmentId,
  solution
});

export const ASSIGNMENT_SOLUTION_SUCCESS = "ASSIGNMENT_SOLUTION_SUCCESS";
export const assignmentSolutionSuccess = (courseId, assignmentId) => ({
  type: ASSIGNMENT_SOLUTION_SUCCESS,
  courseId,
  assignmentId
});

export const ASSIGNMENT_SOLUTION_FAIL = "ASSIGNMENT_SOLUTION_FAIL";
export const assignmentSolutionFail = (courseId, assignmentId, reason) => ({
  type: ASSIGNMENT_SOLUTION_FAIL,
  courseId,
  assignmentId,
  reason
});

export const ASSIGNMENT_CLOSE_DIALOG = "ASSIGNMENT_CLOSE_DIALOG";
export const assignmentCloseDialog = () => ({
  type: ASSIGNMENT_CLOSE_DIALOG
});

export const ASSIGNMENT_DELETE_REQUEST = "ASSIGNMENT_DELETE_REQUEST";
export const assignmentDeleteRequest = assignment => ({
  type: ASSIGNMENT_DELETE_REQUEST,
  assignment
});

export const ASSIGNMENT_DELETE_SUCCESS = "ASSIGNMENT_DELETE_SUCCESS";
// noinspection JSUnusedGlobalSymbols
export const assignmentDeleteSuccess = () => ({
  type: ASSIGNMENT_DELETE_SUCCESS
});
