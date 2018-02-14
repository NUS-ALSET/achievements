import { EXTERNAL_PROFILE_UPDATE_REQUEST } from "./actions";
import { call, takeLatest } from "redux-saga/effects";
import { accountService } from "../../services/account";

export function* externalProfileUpdateRequestHandler(action) {
  yield call(
    accountService.addExternalProfile,
    action.externalProfileType,
    action.uid,
    action.externalProfileId
  );
}

export default [
  function* watchExternalProfileUpdateRequest() {
    yield takeLatest(
      EXTERNAL_PROFILE_UPDATE_REQUEST,
      externalProfileUpdateRequestHandler
    );
  }
];
