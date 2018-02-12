import { call, put, takeLatest } from "redux-saga/effects";
import {
  COURSE_NEW_REQUEST,
  COURSE_REMOVE_REQUEST,
  courseHideDialog,
  courseNewFail,
  courseRemoveFail
} from "./actions";
import { coursesService } from "../../services/courses";
import { notificationShow } from "../Root/actions";

function* courseNewRequestHandle(action) {
  try {
    yield call(coursesService.validateNewCourse, action.name, action.password);
    yield put(courseHideDialog());
    yield call(
      [coursesService, coursesService.createNewCourse],
      action.name,
      action.password
    );
  } catch (err) {
    yield put(courseNewFail());
    yield put(notificationShow(err.message));
  }
}

function* courseRemoveRequestHandle(action) {
  try {
    yield put(courseHideDialog());
    yield call([coursesService, coursesService.deleteCourse], action.courseId);
  } catch (err) {
    yield put(courseRemoveFail());
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchNewCourseRequest() {
    yield takeLatest(COURSE_NEW_REQUEST, courseNewRequestHandle);
  },
  function* watchRemoveCourseRequest() {
    yield takeLatest(COURSE_REMOVE_REQUEST, courseRemoveRequestHandle);
  }
];
