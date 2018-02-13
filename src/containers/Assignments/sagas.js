import { call, put, takeLatest } from "redux-saga/effects";
import {
  ASSIGNMENT_ADD_REQUEST,
  assignmentAddFail,
  assignmentAddSuccess,
  assignmentCloseDialog
} from "./actions";
import { notificationShow } from "../Root/actions";
import { coursesService } from "../../services/courses";

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

export default [
  function* watchNewAssignmentRequest() {
    yield takeLatest(ASSIGNMENT_ADD_REQUEST, addAssignmentRequestHandle);
  }
];
