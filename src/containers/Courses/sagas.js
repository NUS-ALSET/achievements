import { call, put, takeLatest } from "redux-saga/effects";
import {
  COURSE_NEW_REQUEST,
  courseHideNewDialog,
  courseNewFail
} from "./actions";
import { coursesService } from "../../services/courses";
import { notificationShow } from "../Root/actions";

function* courseNewRequestHandle(action) {
  try {
    yield call(
      [coursesService, coursesService.createNewCourse],
      action.name,
      action.password
    );
    yield put(courseHideNewDialog());
  } catch (err) {
    yield put(courseNewFail());
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchNewCourseRequest() {
    yield takeLatest(COURSE_NEW_REQUEST, courseNewRequestHandle);
  }
];
