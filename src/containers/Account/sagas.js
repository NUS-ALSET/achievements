import {
  DISPLAY_NAME_UPDATE_REQUEST,
  displayNameEditToggle,
  displayNameUpdateFail,
  displayNameUpdateSuccess,
  EXTERNAL_PROFILE_REFRESH_REQUEST,
  EXTERNAL_PROFILE_REMOVE_REQUEST,
  EXTERNAL_PROFILE_UPDATE_REQUEST,
  externalProfileRefreshFail,
  externalProfileRefreshRequest,
  externalProfileRefreshSuccess,
  externalProfileRemoveFail,
  externalProfileRemoveSuccess,
  externalProfileUpdateFail,
  externalProfileUpdateSuccess
} from "./actions";
import { select, put, call, takeLatest } from "redux-saga/effects";
import { accountService } from "../../services/account";
import { notificationShow } from "../Root/actions";

export function* externalProfileUpdateRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    yield call(
      accountService.addExternalProfile,
      action.externalProfileType,
      uid,
      action.externalProfileId
    );
    yield put(
      externalProfileUpdateSuccess(
        action.externalProfileId,
        action.externalProfileType
      )
    );
    yield put(
      externalProfileRefreshRequest(
        action.externalProfileId,
        action.externalProfileType
      )
    );
  } catch (err) {
    yield put(
      externalProfileUpdateFail(
        action.externalProfileId,
        action.externalProfileType,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* externalProfileRefreshRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);

    yield call(
      accountService.refreshAchievements,
      action.externalProfileType,
      uid,
      action.externalProfileId
    );
    yield put(
      externalProfileRefreshSuccess(
        action.externalProfileId,
        action.externalProfileType
      )
    );
  } catch (err) {
    yield put(
      externalProfileRefreshFail(
        action.externalProfileId,
        action.externalProfileType,
        err.message
      )
    );
  }
}

function* externalProfileRemoveRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);

    yield call(
      accountService.removeExternalProfile,
      action.externalProfileType,
      uid
    );
    yield put(externalProfileRemoveSuccess(action.externalProfileType));
  } catch (err) {
    yield put(
      externalProfileRemoveFail(action.externalProfileType, err.message)
    );
  }
}

export function* displayNameUpdateRequestHandler(action) {
  const uid = yield select(state => state.firebase.auth.uid);

  try {
    yield call(accountService.updateDisplayName, uid, action.name);
    yield put(displayNameUpdateSuccess());
    yield put(displayNameEditToggle(false));
  } catch (err) {
    yield put(displayNameUpdateFail(err.message));
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchExternalProfileUpdateRequest() {
    yield takeLatest(
      EXTERNAL_PROFILE_UPDATE_REQUEST,
      externalProfileUpdateRequestHandler
    );
  },
  function* watchExternalProfileRefreshRequest() {
    yield takeLatest(
      EXTERNAL_PROFILE_REFRESH_REQUEST,
      externalProfileRefreshRequestHandler
    );
  },
  function* watchExternalProfileRemoveRequest() {
    yield takeLatest(
      EXTERNAL_PROFILE_REMOVE_REQUEST,
      externalProfileRemoveRequestHandler
    );
  },
  function* watchDisplayNameUpdateRequest() {
    yield takeLatest(
      DISPLAY_NAME_UPDATE_REQUEST,
      displayNameUpdateRequestHandler
    );
  }
];
