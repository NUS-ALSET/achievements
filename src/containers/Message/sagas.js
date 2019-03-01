import {
  FETCH_COURSE_MEMBERS,
  fetchCourseMembersSuccess,
  fetchCourseMembersFaliure,
  SEND_MESSAGE,
  sendMessageSuccess,
  sendMessageFaliure
} from "./actions";

import {
  call,
  put,
  takeLatest
} from "redux-saga/effects";

import { notificationShow } from "../Root/actions";
import messageService from "../../services/message";

export function* fetchCourseMembersRequestIterator(action) {
  try {
    const courseMembers = yield call(messageService.fetchCourseMembers, action.courseID);
    yield put(fetchCourseMembersSuccess(courseMembers));
  } catch (err) {
    yield put(fetchCourseMembersFaliure(err));
    yield put(notificationShow(err.message));
  }
}

export function* sendMessageRequestIterator(action) {
  try {
    const response = yield call(messageService.sendMessage, action.data, action.data.collectionName);
    yield put(sendMessageSuccess(response));
  } catch (err) {
    yield put(sendMessageFaliure(err));
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchMessageRequest() {
    yield takeLatest(FETCH_COURSE_MEMBERS, fetchCourseMembersRequestIterator);
    yield takeLatest(SEND_MESSAGE, sendMessageRequestIterator)
  }
];
