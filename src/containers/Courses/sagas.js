import { select, call, put, takeLatest } from "redux-saga/effects";
import {
  COURSE_NEW_REQUEST,
  COURSE_REMOVE_REQUEST,
  courseHideDialog,
  courseNewFail,
  courseNewSuccess,
  courseRemoveFail
} from "./actions";
import { coursesService } from "../../services/courses";
import { notificationShow } from "../Root/actions";
import { solutionsService } from "../../services/solutions";

export function* courseNewRequestHandle(action) {
  try {
    yield call(coursesService.validateNewCourse, action.name, action.password);
    yield put(courseHideDialog());
    yield call(
      [coursesService, coursesService.createNewCourse],
      action.name,
      action.password
    );
    yield put(courseNewSuccess(action.name));
  } catch (err) {
    yield put(courseNewFail(action.name, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* courseRemoveRequestHandle(action) {
  try {
    yield put(courseHideDialog());
    yield call([coursesService, coursesService.deleteCourse], action.courseId);
  } catch (err) {
    yield put(courseRemoveFail());
    yield put(notificationShow(err.message));
  }
}

export function* watchNewCourseRequest() {
  yield takeLatest(COURSE_NEW_REQUEST, courseNewRequestHandle);
}

export function* watchRemoveCourseRequest() {
  yield takeLatest(COURSE_REMOVE_REQUEST, courseRemoveRequestHandle);
}

export function* signInSuccessHandle() {
  const uid = yield select(state => state.firebase.auth.uid);
  yield call([solutionsService, solutionsService.watchOwnCourses], uid);
}

export function* watchSignInSuccess() {
  yield takeLatest("@@reactReduxFirebase/LOGIN", signInSuccessHandle);
}

export default [
  watchNewCourseRequest,
  watchRemoveCourseRequest,
  watchSignInSuccess
];
