import { select, call, put, takeLatest } from "redux-saga/effects";
import {
  COURSE_NEW_REQUEST,
  COURSE_REMOVE_REQUEST,
  courseHideDialog,
  courseNewFail,
  courseNewSuccess,
  courseRemoveFail,
  courseRemoveSuccess
} from "./actions";
import { coursesService } from "../../services/courses";
import { notificationShow } from "../Root/actions";
// import { solutionsService } from "../../services/solutions";

export function* courseNewRequestHandle(action) {
  try {
    yield call(coursesService.validateNewCourse, action.name, action.password);
    yield put(courseHideDialog());
    const key = yield call(
      [coursesService, coursesService.createNewCourse],
      action.name,
      action.password
    );
    yield put(courseNewSuccess(action.name, key));
  } catch (err) {
    yield put(courseNewFail(action.name, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* courseRemoveRequestHandle(action) {
  try {
    yield put(courseHideDialog());
    yield call([coursesService, coursesService.deleteCourse], action.courseId);
    yield put(courseRemoveSuccess(action.courseId));
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

  // Uncomment this line to get instructors solutions tracker
  // yield call([solutionsService, solutionsService.watchOwnCourses], uid);
  yield call([coursesService, coursesService.watchJoinedCourses], uid);
}

export function* watchSignInSuccess() {
  yield takeLatest("@@reactReduxFirebase/LOGIN", signInSuccessHandle);
  yield call([coursesService, coursesService.watchJoinedCourses]);
}

export default [
  watchNewCourseRequest,
  watchRemoveCourseRequest,
  watchSignInSuccess
];
