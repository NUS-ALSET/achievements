import { APP_SETTING } from "../../achievementsApp/config";
import {
  ASSIGNMENTS_EDITOR_TABLE_SHOWN,
  ASSIGNMENT_ADD_REQUEST,
  ASSIGNMENT_QUICK_UPDATE_REQUEST,
  ASSIGNMENT_REORDER_REQUEST,
  ASSIGNMENT_SOLUTION_REQUEST,
  UPDATE_NEW_ASSIGNMENT_FIELD,
  assignmentAddFail,
  assignmentAddSuccess,
  assignmentCloseDialog,
  assignmentQuickUpdateFail,
  assignmentQuickUpdateSuccess,
  assignmentReorderFail,
  assignmentReorderSuccess,
  assignmentSolutionFail,
  assignmentSolutionSuccess,
  updateNewAssignmentField
} from "./actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { coursesService } from "../../services/courses";
import { notificationShow } from "../Root/actions";

export function* addAssignmentRequestHandle(action) {
  try {
    const assignments = yield select(
      state => state.firebase.data.assignments[action.courseId]
    );
    yield call(coursesService.validateAssignment, action.assignment);
    yield put(assignmentCloseDialog());
    yield call(
      coursesService.addAssignment,
      action.courseId,
      action.assignment,
      assignments
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

export function* assignmentQuickUpdateRequestHandler(action) {
  try {
    yield call(
      [coursesService, coursesService.updateAssignment],
      action.courseId,
      action.assignmentId,
      action.field,
      action.value
    );
    yield put(assignmentQuickUpdateSuccess(action));
  } catch (err) {
    yield put(assignmentQuickUpdateFail({ ...action, reason: err.message }));
    yield put(notificationShow(err.message));
  }
}

export function* assignmentReorderRequestHandler(action) {
  try {
    const assignments = yield select(state => state.firebase.data.assignments);
    yield call(
      [coursesService, coursesService.reorderAssignment],
      assignments,
      action.courseId,
      action.assignmentId,
      action.increase
    );
    yield put(
      assignmentReorderSuccess(
        action.courseId,
        action.assignmentId,
        action.increase
      )
    );
  } catch (err) {
    yield put(
      assignmentReorderFail(action.courseId, action.assignmentId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* assignmentsEditorTableShownHandler(action) {
  const assignments = yield select(
    state => state.firebase.data.assignments[action.courseId]
  );
  try {
    yield call(
      coursesService.processAssignmentsOrderIndexes,
      action.courseId,
      assignments
    );
  } catch (err) {
    yield put(
      notificationShow(
        `Error occurs during assignments default order indexes set: ${
          err.message
        }`
      )
    );
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
  },
  function* watchUpdateAssignmentRequest() {
    yield takeLatest(
      ASSIGNMENT_QUICK_UPDATE_REQUEST,
      assignmentQuickUpdateRequestHandler
    );
  },
  function* watchAssignmentReorderRequest() {
    yield takeLatest(
      ASSIGNMENT_REORDER_REQUEST,
      assignmentReorderRequestHandler
    );
  },
  function* watchAssignmentsEditorTableShown() {
    yield takeLatest(
      ASSIGNMENTS_EDITOR_TABLE_SHOWN,
      assignmentsEditorTableShownHandler
    );
  }
];
