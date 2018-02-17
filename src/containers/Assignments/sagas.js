import { select, call, put, takeLatest } from "redux-saga/effects";
import {
  ASSIGNMENT_ADD_REQUEST,
  ASSIGNMENT_SOLUTION_REQUEST,
  assignmentAddFail,
  assignmentAddSuccess,
  assignmentCloseDialog,
  assignmentSolutionFail,
  assignmentSolutionSuccess,
  UPDATE_NEW_ASSIGNMENT_FIELD,
  updateNewAssignmentField
} from "./actions";
import { notificationShow } from "../Root/actions";
import { coursesService } from "../../services/courses";
import { APP_SETTING } from "../../achievementsApp/config";

export function* addAssignmentRequestHandle(action) {
  try {
    yield call(coursesService.validateAssignment, action.assignment);
    yield put(assignmentCloseDialog());
    yield call(
      coursesService.addAssignment,
      action.courseId,
      action.assignment
    );
    yield put(assignmentAddSuccess());
  } catch (err) {
    yield put(assignmentAddFail(err.message));
    yield put(notificationShow(err.message));
  }
}

export function* updateNewAssignmentFieldHandler(action) {
  if (action.field === "details") {
    return yield Promise.resolve();
  }

  let assignment = yield select(state => state.assignments.dialog.value);

  assignment = assignment || {};
  if (["CodeCombat_Number", "Profile"].includes(assignment.questionType)) {
    yield put(updateNewAssignmentField("details", "https://codecombat.com"));
  }

  if (action.field === "level") {
    yield put(
      updateNewAssignmentField("details", APP_SETTING.levels[action.value].url)
    );
  }
}

export function* assignmentSolutionRequestHandler(action) {
  const assignment = yield select(
    state =>
      state.firebase.data.assignments[action.courseId][action.assignmentId]
  );

  try {
    yield call(
      [coursesService, coursesService.submitSolution],
      action.courseId,
      { ...assignment, id: action.assignmentId },
      action.solution
    );
    yield put(assignmentSolutionSuccess(action.courseId, action.assignmentId));
    yield put(
      notificationShow(`Solution submitted for assignment "${assignment.name}"`)
    );
  } catch (err) {
    yield put(
      assignmentSolutionFail(action.courseId, action.assignmentId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchNewAssignmentRequest() {
    yield takeLatest(ASSIGNMENT_ADD_REQUEST, addAssignmentRequestHandle);
  },
  function* watchUpdateNewAssignmentField() {
    yield takeLatest(
      UPDATE_NEW_ASSIGNMENT_FIELD,
      updateNewAssignmentFieldHandler
    );
  },
  function* watchAssignmentSubmitRequest() {
    yield takeLatest(
      ASSIGNMENT_SOLUTION_REQUEST,
      assignmentSolutionRequestHandler
    );
  }
];
