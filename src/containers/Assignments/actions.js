// This action initiates fetching course members data
export const COURSE_ASSIGNMENTS_OPEN = "COURSE_ASSIGNMENTS_OPEN";
export const courseAssignmentsOpen = courseId => ({
  type: COURSE_ASSIGNMENTS_OPEN,
  courseId
});

export const COURSE_ASSIGNMENTS_CLOSE = "COURSE_ASSIGNMENTS_CLOSE";
export const courseAssignmentsClose = courseId => ({
  type: COURSE_ASSIGNMENTS_CLOSE,
  courseId
});

export const COURSE_MEMBERS_FETCH_FAIL = "COURSE_MEMBERS_FETCH_FAIL";
export const courseMembersFetchFail = (courseId, reason) => ({
  type: COURSE_MEMBERS_FETCH_FAIL,
  courseId,
  reason
});

export const COURSE_MEMBERS_FETCH_SUCCESS = "COURSE_MEMBERS_FETCH_SUCCESS";
export const courseMembersFetchSuccess = (courseId, courseMembers) => ({
  type: COURSE_MEMBERS_FETCH_SUCCESS,
  courseId,
  courseMembers
});

export const COURSE_PATHS_FETCH_SUCCESS = "COURSE_PATHS_FETCH_SUCCESS";
export const coursePathsFetchSuccess = (courseId, paths) => ({
  type: COURSE_PATHS_FETCH_SUCCESS,
  courseId,
  paths
});

export const COURSE_MEMBER_ACHIEVEMENTS_REFETCH =
  "COURSE_MEMBER_ACHIEVEMENTS_REFETCH";
export const courseMemberAchievementsRefetch = (
  courseId,
  studentId,
  achievements
) => ({
  type: COURSE_MEMBER_ACHIEVEMENTS_REFETCH,
  courseId,
  studentId,
  achievements
});

export const COURSE_PASSWORD_ENTER_REQUEST = "COURSE_PASSWORD_ENTER_REQUEST";
export const coursePasswordEnterRequest = (courseId, password) => ({
  type: COURSE_PASSWORD_ENTER_REQUEST,
  courseId,
  password
});

export const COURSE_PASSWORD_ENTER_SUCCESS = "COURSE_PASSWORD_ENTER_SUCCESS";
export const coursePasswordEnterSuccess = courseId => ({
  type: COURSE_PASSWORD_ENTER_SUCCESS,
  courseId
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

export const ASSIGNMENT_SHOW_EDIT_DIALOG = "ASSIGNMENT_SHOW_EDIT_DIALOG";
export const assignmentShowEditDialog = assignment => ({
  type: ASSIGNMENT_SHOW_EDIT_DIALOG,
  assignment
});

export const UPDATE_NEW_ASSIGNMENT_FIELD = "UPDATE_NEW_ASSIGNMENT_FIELD";
export const updateNewAssignmentField = (field, value) => ({
  type: UPDATE_NEW_ASSIGNMENT_FIELD,
  field,
  value
});

export const SET_DEFAULT_ASSIGNMENT_FIELDS = "SET_DEFAULT_ASSIGNMENT_FIELDS";
export const setDefaultAssignmentFields = fields => ({
  type: SET_DEFAULT_ASSIGNMENT_FIELDS,
  fields
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

export const ASSIGNMENT_REFRESH_PROFILES_REQUEST =
  "ASSIGNMENT_REFRESH_PROFILES_REQUEST";
export const assignmentRefreshProfilesRequest = courseId => ({
  type: ASSIGNMENT_REFRESH_PROFILES_REQUEST,
  courseId
});

export const ASSIGNMENT_REFRESH_PROFILES_SUCCESS =
  "ASSIGNMENT_REFRESH_PROFILES_SUCCESS";
export const assignmentRefreshProfilesSuccess = courseId => ({
  type: ASSIGNMENT_REFRESH_PROFILES_SUCCESS,
  courseId
});

export const ASSIGNMENT_REFRESH_PROFILES_FAIL =
  "ASSIGNMENT_REFRESH_PROFILES_FAIL";
export const assignmentRefreshProfilesFail = (courseId, reason) => ({
  type: ASSIGNMENT_REFRESH_PROFILES_FAIL,
  courseId,
  reason
});

export const ASSIGNMENT_QUICK_UPDATE_REQUEST =
  "ASSIGNMENT_QUICK_UPDATE_REQUEST";
export const assignmentQuickUpdateRequest = (
  courseId,
  assignmentId,
  field,
  value
) => ({
  type: ASSIGNMENT_QUICK_UPDATE_REQUEST,
  courseId,
  assignmentId,
  field,
  value
});

export const ASSIGNMENT_QUICK_UPDATE_SUCCESS =
  "ASSIGNMENT_QUICK_UPDATE_SUCCESS";
export const assignmentQuickUpdateSuccess = (
  courseId,
  assignmentId,
  field,
  value
) => ({
  type: ASSIGNMENT_QUICK_UPDATE_SUCCESS,
  courseId,
  assignmentId,
  field,
  value
});

export const ASSIGNMENT_QUICK_UPDATE_FAIL = "ASSIGNMENT_QUICK_UPDATE_FAIL";
export const assignmentQuickUpdateFail = (
  courseId,
  assignmentId,
  field,
  value,
  reason
) => ({
  type: ASSIGNMENT_QUICK_UPDATE_FAIL,
  courseId,
  assignmentId,
  field,
  value,
  reason
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

export const ASSIGNMENT_PATH_PROBLEM_SOLUTION_REQUEST =
  "ASSIGNMENT_PATH_PROBLEM_SOLUTION_REQUEST";
export const assignmentPathProblemSolutionRequest = (
  assignment,
  problemOwner,
  problemId,
  solution,
  readOnly = false
) => ({
  type: ASSIGNMENT_PATH_PROBLEM_SOLUTION_REQUEST,
  assignment,
  problemOwner,
  problemId,
  solution,
  readOnly
});

export const ASSIGNMENT_PATH_PROGRESS_SOLUTION_REQUEST =
  "ASSIGNMENT_PATH_PROGRESS_SOLUTION_REQUEST";
export const assignmentPathProgressSolutionRequest = (
  assignment,
  pathOwner,
  pathId,
  solution
) => ({
  type: ASSIGNMENT_PATH_PROGRESS_SOLUTION_REQUEST,
  assignment,
  pathOwner,
  pathId,
  solution
});

export const ASSIGNMENT_TEAM_CHOICE_SOLUTION_REQUEST =
  "ASSIGNMENT_TEAM_CHOICE_SOLUTION_REQUEST";
export const assignmentTeamChoiceSolutionRequest = (
  courseId,
  assignment,
  solution
) => ({
  type: ASSIGNMENT_TEAM_CHOICE_SOLUTION_REQUEST,
  courseId,
  assignment,
  solution
});

export const ASSIGNMENT_TEAM_CHOICE_SOLUTION_SUCCESS =
  "ASSIGNMENT_TEAM_CHOICE_SOLUTION_SUCCESS";
export const assignmentTeamChoiceSolutionSuccess = (
  courseId,
  assignment,
  solution,
  options
) => ({
  type: ASSIGNMENT_TEAM_CHOICE_SOLUTION_SUCCESS,
  courseId,
  assignment,
  solution,
  options
});

export const ASSIGNMENT_SOLUTION_REQUEST = "ASSIGNMENT_SOLUTION_REQUEST";
export const assignmentSolutionRequest = (
  courseId,
  assignmentId,
  solution,
  options
) => ({
  type: ASSIGNMENT_SOLUTION_REQUEST,
  courseId,
  assignmentId,
  solution,
  options
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

export const ASSIGNMENT_REORDER_REQUEST = "ASSIGNMENT_REORDER_REQUEST";
export const assignmentReorderRequest = (courseId, assignmentId, increase) => ({
  type: ASSIGNMENT_REORDER_REQUEST,
  courseId,
  assignmentId,
  increase
});

export const ASSIGNMENT_REORDER_SUCCESS = "ASSIGNMENT_REORDER_SUCCESS";
export const assignmentReorderSuccess = (courseId, assignmentId, increase) => ({
  type: ASSIGNMENT_REORDER_SUCCESS,
  courseId,
  assignmentId,
  increase
});

export const ASSIGNMENT_REORDER_FAIL = "ASSIGNMENT_REORDER_FAIL";
export const assignmentReorderFail = (courseId, assignmentId, increase) => ({
  type: ASSIGNMENT_REORDER_FAIL,
  courseId,
  assignmentId,
  increase
});

export const ASSIGNMENTS_EDITOR_TABLE_SHOWN = "ASSIGNMENTS_EDITOR_TABLE_SHOWN";
export const assignmentsEditorTableShown = courseId => ({
  type: ASSIGNMENTS_EDITOR_TABLE_SHOWN,
  courseId
});

// Not usual request, it should collect assistants data to open
export const ASSIGNMENTS_ASSISTANTS_SHOW_REQUEST =
  "ASSIGNMENTS_ASSISTANTS_SHOW_REQUEST";
export const assignmentsAssistantsShowRequest = courseId => ({
  type: ASSIGNMENTS_ASSISTANTS_SHOW_REQUEST,
  courseId
});

export const ASSIGNMENTS_ASSISTANTS_DIALOG_SHOW =
  "ASSIGNMENTS_ASSISTANTS_DIALOG_SHOW";
export const assignmentsAssistantsDialogShow = (courseId, assistants) => ({
  type: ASSIGNMENTS_ASSISTANTS_DIALOG_SHOW,
  courseId,
  assistants
});

export const ASSIGNMENT_ASSISTANT_KEY_CHANGE =
  "ASSIGNMENT_ASSISTANT_KEY_CHANGE";
export const assignmentAssistantKeyChange = assistantKey => ({
  type: ASSIGNMENT_ASSISTANT_KEY_CHANGE,
  assistantKey
});

export const ASSIGNMENT_ASSISTANT_FOUND = "ASSIGNMENT_ASSISTANT_FOUND";
export const assignmentAssistantFound = assistant => ({
  type: ASSIGNMENT_ASSISTANT_FOUND,
  assistant
});

export const ASSIGNMENT_ADD_ASSISTANT_REQUEST =
  "ASSIGNMENT_ADD_ASSISTANT_REQUEST";
export const assignmentAddAssistantRequest = (courseId, assistantId) => ({
  type: ASSIGNMENT_ADD_ASSISTANT_REQUEST,
  courseId,
  assistantId
});

export const ASSIGNMENT_ADD_ASSISTANT_SUCCESS =
  "ASSIGNMENT_ADD_ASSISTANT_SUCCESS";
export const assignmentAddAssistantSuccess = (courseId, assistantId) => ({
  type: ASSIGNMENT_ADD_ASSISTANT_SUCCESS,
  courseId,
  assistantId
});

export const ASSIGNMENT_ADD_ASSISTANT_FAIL = "ASSIGNMENT_ADD_ASSISTANT_FAIL";
export const assignmentAddAssistantFail = (courseId, assistantId, reason) => ({
  type: ASSIGNMENT_ADD_ASSISTANT_FAIL,
  courseId,
  assistantId,
  reason
});

export const ASSIGNMENT_REMOVE_ASSISTANT_REQUEST =
  "ASSIGNMENT_REMOVE_ASSISTANT_REQUEST";
export const assignmentRemoveAssistantRequest = (courseId, assistantId) => ({
  type: ASSIGNMENT_REMOVE_ASSISTANT_REQUEST,
  courseId,
  assistantId
});

export const ASSIGNMENT_REMOVE_ASSISTANT_SUCCESS =
  "ASSIGNMENT_REMOVE_ASSISTANT_SUCCESS";
export const assignmentRemoveAssistantSuccess = (courseId, assistantId) => ({
  type: ASSIGNMENT_REMOVE_ASSISTANT_SUCCESS,
  courseId,
  assistantId
});

export const ASSIGNMENT_REMOVE_ASSISTANT_FAIL =
  "ASSIGNMENT_REMOVE_ASSISTANT_FAIL";
export const assignmentRemoveAssistantFail = (courseId, assistantId) => ({
  type: ASSIGNMENT_REMOVE_ASSISTANT_FAIL,
  courseId,
  assistantId
});

export const COURSE_REMOVE_STUDENT_REQUEST = "COURSE_REMOVE_STUDENT_REQUEST";
export const courseRemoveStudentRequest = (courseId, studentId) => ({
  type: COURSE_REMOVE_STUDENT_REQUEST,
  courseId,
  studentId
});

export const COURSE_REMOVE_STUDENT_SUCCESS = "COURSE_REMOVE_STUDENT_SUCCESS";
export const courseRemoveStudentSuccess = () => ({
  type: COURSE_REMOVE_STUDENT_SUCCESS
});

export const COURSE_REMOVE_STUDENT_FAIL = "COURSE_REMOVE_STUDENT_FAIL";
export const courseRemoveStudentFail = (courseId, studentId, reason) => ({
  type: COURSE_REMOVE_STUDENT_FAIL,
  courseId,
  studentId,
  reason
});

export const ASSIGNMENT_PATHS_FETCH_SUCCESS = "ASSIGNMENT_PATHS_FETCH_SUCCESS";
export const assignmentPathsFetchSuccess = paths => ({
  type: ASSIGNMENT_PATHS_FETCH_SUCCESS,
  paths
});

export const ASSIGNMENT_PROBLEMS_FETCH_SUCCESS =
  "ASSIGNMENT_PROBLEMS_FETCH_SUCCESS";
export const assignmentProblemsFetchSuccess = problems => ({
  type: ASSIGNMENT_PROBLEMS_FETCH_SUCCESS,
  problems
});

export const ASSIGNMENT_PATH_PROBLEM_FETCH_SUCCESS =
  "ASSIGNMENT_PATH_PROBLEM_FETCH_SUCCESS";
export const assignmentPathProblemFetchSuccess = (pathProblem, solution) => ({
  type: ASSIGNMENT_PATH_PROBLEM_FETCH_SUCCESS,
  pathProblem,
  solution
});

export const ASSIGNMENT_PATH_PROGRESS_FETCH_SUCCESS =
  "ASSIGNMENT_PATH_PROGRESS_FETCH_SUCCESS";
export const assignmentPathProgressFetchSuccess = pathProgress => ({
  type: ASSIGNMENT_PATH_PROGRESS_FETCH_SUCCESS,
  pathProgress
});

export const COURSE_REMOVE_STUDENT_DIALOG_SHOW =
  "COURSE_REMOVE_STUDENT_DIALOG_SHOW";
export const courseRemoveStudentDialogShow = (
  courseId,
  studentId,
  studentName
) => ({
  type: COURSE_REMOVE_STUDENT_DIALOG_SHOW,
  courseId,
  studentId,
  studentName
});

export const COURSE_MOVE_STUDENT_DIALOG_SHOW =
  "COURSE_MOVE_STUDENT_DIALOG_SHOW";
export const courseMoveStudentDialogShow = (
  courseId,
  studentId,
  studentName
) => ({
  type: COURSE_MOVE_STUDENT_DIALOG_SHOW,
  courseId,
  studentId,
  studentName
});

export const COURSE_MOVE_STUDENT_REQUEST = "COURSE_MOVE_STUDENT_REQUEST";
export const courseMoveStudentRequest = (
  sourceCourseId,
  targetCourseId,
  studentId
) => ({
  type: COURSE_MOVE_STUDENT_REQUEST,
  sourceCourseId,
  targetCourseId,
  studentId
});

export const COURSE_MOVE_STUDENT_SUCCESS = "COURSE_MOVE_STUDENT_SUCCESS";
export const courseMoveStudentSuccess = (
  sourceCourseId,
  targetCourseId,
  studentId
) => ({
  type: COURSE_MOVE_STUDENT_SUCCESS,
  sourceCourseId,
  targetCourseId,
  studentId
});

export const COURSE_MOVE_STUDENT_FAIL = "COURSE_MOVE_STUDENT_FAIL";
export const courseMoveStudentFail = (
  sourceCourseId,
  targetCourseId,
  studentId,
  reason
) => ({
  type: COURSE_MOVE_STUDENT_FAIL,
  sourceCourseId,
  targetCourseId,
  studentId,
  reason
});

export const COURSE_MY_COURSES_FETCH_SUCCESS =
  "COURSE_MY_COURSES_FETCH_SUCCESS";
export const courseMyCoursesFetchSuccess = courses => ({
  type: COURSE_MY_COURSES_FETCH_SUCCESS,
  courses
});

export const ASSIGNMENTS_SOLUTIONS_REFRESH_REQUEST =
  "ASSIGNMENTS_SOLUTIONS_REFRESH_REQUEST";
export const assignmentsSolutionsRefreshRequest = courseId => ({
  type: ASSIGNMENTS_SOLUTIONS_REFRESH_REQUEST,
  courseId
});

export const ASSIGNMENTS_SOLUTIONS_REFRESH_SUCCESS =
  "ASSIGNMENTS_SOLUTIONS_REFRESH_SUCCESS";
export const assignmentsSolutionsRefreshSuccess = courseId => ({
  type: ASSIGNMENTS_SOLUTIONS_REFRESH_SUCCESS,
  courseId
});

export const ASSIGNMENTS_SOLUTIONS_REFRESH_FAIL =
  "ASSIGNMENTS_SOLUTIONS_REFRESH_FAIL";
export const assignmentsSolutionsRefreshFail = (courseId, reason) => ({
  type: ASSIGNMENTS_SOLUTIONS_REFRESH_FAIL,
  courseId,
  reason
});

export const ASSIGNMENTS_SHOW_HIDDEN_TOGGLE = "ASSIGNMENTS_SHOW_HIDDEN_TOGGLE";
export const assignmentsShowHiddenToggle = courseId => ({
  type: ASSIGNMENTS_SHOW_HIDDEN_TOGGLE,
  courseId
});

export const ENABLE_COMMIT_AFTER_AUTOFILL = "ENABLE_COMMIT_AFTER_AUTOFILL";
export const enableCommitAfterAutofill = () => ({
  type: ENABLE_COMMIT_AFTER_AUTOFILL
});

/*
export const ASSIGNMENTS_TEST_SOMETHING = "ASSIGNMENTS_TEST_SOMETHING";
export const assignmentsTestSomething = courseId => ({
  type: ASSIGNMENTS_TEST_SOMETHING,
  courseId
});
*/
