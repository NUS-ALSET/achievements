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
  accountChangeAdminStatus,
  PROFILE_UPDATE_DATA_REQUEST,
  profileUpdateDataFail,
  profileUpdateDataSuccess,
  ACCOUNT_OPEN,
  accountFetchPaths,
  FETCH_USER_DATA,
  fetchUserDataFail,
  INSPECT_PATH_AS_USER
} from "./actions";
import { accountService } from "../../services/account";
import { call, put, race, select, take, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";
import { push } from "connected-react-router";
import { notificationShow } from "../Root/actions";
import {
  getDynamicPathtitle,
  GET_DYNAMIC_PATHTITLE,
  SAVE_PROMO_CODE,
  ROUTES_CHANGED
} from "../AppFrame/actions";
import download from "downloadjs";

function* signInHandler() {
  const uid = yield select(state => state.firebase.auth.uid);
  const promocode = yield select(state => state.appFrame.promocode);
  try {
    if (uid) {
      if (promocode) {
        yield call(accountService.savePromoCode, {
          uid,
          promocode,
          type: SAVE_PROMO_CODE
        });
      }
      const adminStatus = yield call(accountService.checkAdminStatus, uid);
      yield call(accountService.authTimeUpdate, uid);
      yield put(accountChangeAdminStatus(adminStatus));
    } else {
      yield put(accountChangeAdminStatus(false));
    }
  } catch (err) {
    accountChangeAdminStatus(false, err.message);
  }
}

function* accountOpenHandler(action) {
  let uid = yield select(state => state.firebase.auth.uid);

  if (!uid) {
    yield take("@@reactReduxFirebase/LOGIN");
    uid = yield select(state => state.firebase.auth.uid);
  }
  try {
    const paths = yield call(accountService.fetchJoinedPaths, action.accountId);

    if (!paths) {
      yield put(notificationShow("Wrong user ID. Redirecting to your profile"));
      yield put(push(`/profile/${uid}`));
    } else {
      yield put(accountFetchPaths(action.accountId, paths));
    }
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

function* inspectPathAsUserHandler(action) {
  const user = yield select(state => state.firebase.data.users[action.userId]);
  yield put(push(`/paths/${action.pathId}`));
  yield take(GET_DYNAMIC_PATHTITLE);
  yield put(getDynamicPathtitle(`Path (as ${user.displayName})`));
}

function* externalProfileUpdateRequestHandler(action) {
  try {
    let error = "";
    const uid = yield select(
      state => action.customUID || state.firebase.auth.uid
    );

    yield call(
      accountService.addExternalProfile,
      action.externalProfileType,
      uid,
      action.externalProfileId
    );
    yield put(
      externalProfileRefreshRequest(
        action.externalProfileId,
        action.externalProfileType,
        action.customUID
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
      error = "Invalid CodeCombat username provided";
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

function* externalProfileRefreshRequestHandler(action) {
  try {
    const uid = yield select(
      state => action.customUID || state.firebase.auth.uid
    );

    yield call(
      accountService.refreshAchievements,
      action.externalProfileType,
      uid,
      action.externalProfileId
    );
    yield put(
      notificationShow(
        `Refreshing ${action.externalProfileType} Achievements...`
      )
    );
    const result = yield race({
      response: call(
        [accountService, accountService.watchProfileRefresh],
        uid,
        action.externalProfileType
      ),
      timedOut: call(delay, APP_SETTING.defaultTimeout)
    });

    if (result.timedOut) {
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

    if (result.response) {
      yield put(
        externalProfileRefreshSuccess(
          action.externalProfileId,
          action.externalProfileType
        )
      );
    }
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

function* profileUpdateDataRequestHandler(action) {
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    accountService.updateProfileData(
      action.customUID || uid,
      action.field,
      action.data
    );
    yield put(
      profileUpdateDataSuccess(
        action.field,
        action.data,
        action.customUID || uid
      )
    );
  } catch (err) {
    yield put(profileUpdateDataFail(action.field, action.data, err.message));
    yield put(notificationShow(err.message));
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

function* fetchUserDataHandler() {
  const uid = yield select(state => state.firebase.auth.uid);
  try {
    const userData = yield call(accountService.fetchUserJSON, uid);
    download(
      JSON.stringify(userData.data, null, 2),
      "user-achievements.json",
      "text/plain"
    );
  } catch (err) {
    yield put(fetchUserDataFail(err.message));
  }
}

function* routeChangeHandler(action){
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    const promocode = yield select(state => state.appFrame.promocode);
    if (uid && promocode) {
       yield call(accountService.saveNavigationChange, {
        uid,
        promocode,
        pathName : action.pathName
      });
      }
  } catch (err) {
    // do nothing
  }
}

export default [
  function* watchSignIn() {
    yield takeLatest("@@reactReduxFirebase/LOGIN", signInHandler);
  },
  function* watchAccountOpen() {
    yield takeLatest(ACCOUNT_OPEN, accountOpenHandler);
  },
  function* watchInspectPathAsUser() {
    yield takeLatest(INSPECT_PATH_AS_USER, inspectPathAsUserHandler);
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
  function* watchProfileUpdateDataRequest() {
    yield takeLatest(
      PROFILE_UPDATE_DATA_REQUEST,
      profileUpdateDataRequestHandler
    );
  },
  function* watchDisplayNameUpdateRequest() {
    yield takeLatest(
      DISPLAY_NAME_UPDATE_REQUEST,
      displayNameUpdateRequestHandler
    );
  },
  function* watchFetchUserData() {
    yield takeLatest(FETCH_USER_DATA, fetchUserDataHandler);
  },
  function* watchRouteChange(){
    yield takeLatest(ROUTES_CHANGED, routeChangeHandler);
  }
];
