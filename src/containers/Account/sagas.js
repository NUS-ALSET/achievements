import { APP_SETTING } from "../../achievementsApp/config";
import {
  DISPLAY_NAME_UPDATE_REQUEST,
  EXTERNAL_PROFILE_REFRESH_REQUEST,
  EXTERNAL_PROFILE_REMOVE_REQUEST,
  EXTERNAL_PROFILE_UPDATE_REQUEST,
  displayNameEditToggle,
  displayNameUpdateFail,
  displayNameUpdateSuccess,
  externalProfileDialogHide,
  externalProfileRefreshFail,
  externalProfileRefreshRequest,
  externalProfileRefreshSuccess,
  externalProfileRemoveFail,
  externalProfileRemoveSuccess,
  externalProfileUpdateFail,
  externalProfileUpdateSuccess,
  accountChangeAdminStatus
} from "./actions";
import { accountService } from "../../services/account";
import { call, put, race, select, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";
import { notificationShow } from "../Root/actions";

export function* signInHandler() {
  const uid = yield select(state => state.firebase.auth.uid);

  try {
    if (uid) {
      const adminStatus = yield call(accountService.checkAdminStatus, uid);
      yield put(accountChangeAdminStatus(adminStatus));
    } else {
      yield put(accountChangeAdminStatus(false));
    }
  } catch (err) {
    accountChangeAdminStatus(false, err.message);
  }
}

export function* externalProfileUpdateRequestHandler(action) {
  try {
    let error = "";
    const uid = yield select(state => state.firebase.auth.uid);

    yield call(
      accountService.addExternalProfile,
      action.externalProfileType,
      uid,
      action.externalProfileId
    );
    yield put(
      externalProfileRefreshRequest(
        action.externalProfileId,
        action.externalProfileType
      )
    );
    const { response, timedOut } = yield race({
      response: call(
        [accountService, accountService.watchProfileRefresh],
        uid,
        action.externalProfileType
      ),
      timedOut: call(delay, APP_SETTING.defaultTimeout)
    });

    if (timedOut) {
      error = "Profile refreshing timed out";
    } else if (!response) {
      error = "Wrong profile was provided";
    }

    if (error) {
      yield put(
        externalProfileUpdateFail(
          action.externalProfileId,
          action.externalProfileType,
          error
        )
      );
      return yield put(notificationShow(error));
    }

    yield put(
      externalProfileUpdateSuccess(
        action.externalProfileId,
        action.externalProfileType
      )
    );
    yield put(externalProfileDialogHide());
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
    const { timedOut } = yield race({
      response: call(
        [accountService, accountService.watchProfileRefresh],
        uid,
        action.externalProfileType
      ),
      timedOut: call(delay, APP_SETTING.defaultTimeout)
    });

    if (timedOut) {
      const error = "Profile refresh timed out";
      yield put(
        externalProfileRefreshFail(
          action.externalProfileId,
          action.externalProfileType,
          error
        )
      );
      return yield put(notificationShow(error));
    }

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
  function* watchSignIn() {
    yield takeLatest("@@reactReduxFirebase/LOGIN", signInHandler);
  },
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
