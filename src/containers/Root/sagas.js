import {
  ACCEPT_EULA_REQUEST,
  NOTIFICATION_SHOW,
  notificationShow,
  SIGN_IN_REQUEST,
  SIGN_OUT_REQUEST,
  acceptEulaFail,
  acceptEulaSuccess,
  notificationHide,
  showAcceptEulaDialog,
  signInSuccess,
  signOutSuccess,
  versionChange
} from "./actions";
import { APP_SETTING } from "../../achievementsApp/config";
import { accountService } from "../../services/account";
import {
  call,
  put,
  take,
  takeLatest,
  spawn
} from "redux-saga/effects";
import { delay, eventChannel } from "redux-saga";
import compareVersions from "compare-versions";


const createVersionWatcherChannel = () => {
  return eventChannel(emit =>
    accountService.watchVersionChange(version => emit(version))
  );
}

let versionWatcherChannel;

function* versionChangeHandler() {
  versionWatcherChannel = yield call(createVersionWatcherChannel);
  while (true) {
    const { version } = yield take(versionWatcherChannel);
    yield put(
      versionChange(
        version && compareVersions(version, process.env.REACT_APP_VERSION) === 1
      )
    );
  }
}

function* handleFirebaseSignIn() {
  if (!versionWatcherChannel) {
    yield spawn(versionChangeHandler);
  }
  const isAgreedEULA = yield call(accountService.checkEULAAgreement);
  if (!isAgreedEULA) {
    yield put(showAcceptEulaDialog());
  }
}

export function* handleSignInRequest() {
  try {
    yield call(accountService.signIn);
    yield put(signInSuccess());
    yield put(notificationShow("Successfully signed in"))
  } catch (err) {
    yield put(notificationShow("Failed to sign in"));
    console.error("signed in error: ", err)
  }
}


export function* handleSignOut() {
  try {
    yield call(accountService.signOut);
    yield put(signOutSuccess());
    yield put(notificationShow("You have signed out"))
  } catch (err) {
    yield put(notificationShow("Failed to sign out"));
    console.error("signed out error: ", err)
  }

}

function* autoHideNotification() {
  yield delay(APP_SETTING.defaultTimeout);
  yield put(notificationHide());
}

function* handleAcceptEULARequest() {
  try {
    yield call(accountService.acceptEULA);
    yield put(acceptEulaSuccess());
  } catch (err) {
    yield put(acceptEulaFail(err.message));
    yield put(notificationShow("Failed to accept EULA request"));
    console.error("EULA error: ", err)
  }
}

export default [
  function* watchSignInRequests() {
    yield takeLatest(SIGN_IN_REQUEST, handleSignInRequest);
  },
  function* watchSignOutRequests() {
    yield takeLatest(SIGN_OUT_REQUEST, handleSignOut);
  },
  function* watchNotifications() {
    yield takeLatest(NOTIFICATION_SHOW, autoHideNotification);
  },
  function* watchFirebaseLogin() {
    yield takeLatest("@@reactReduxFirebase/LOGIN", handleFirebaseSignIn);
  },
  function* watchAcceptEULARequest() {
    yield takeLatest(ACCEPT_EULA_REQUEST, handleAcceptEULARequest);
  }
];
