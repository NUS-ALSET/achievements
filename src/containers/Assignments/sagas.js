import { select, call, put, takeLatest } from "redux-saga/effects";
import {
  ASSIGNMENT_ADD_REQUEST,
  assignmentAddFail,
  assignmentAddSuccess,
  assignmentCloseDialog,
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
  let assignment = yield select(state => state.assignments.dialog.value);

  assignment = assignment || {};
  if (assignment.questionType === "Profile") {
    yield put(updateNewAssignmentField("details", "https://codecombat.com"));
  }

  if (action.field === "level") {
    yield put(
      updateNewAssignmentField("details", APP_SETTING.levels[action.value].url)
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
  }
];
