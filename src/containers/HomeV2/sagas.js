import { call, select, takeLatest } from "redux-saga/effects";
import { UPDATE_RECOMMENDATION } from "./actions";
import { accountService } from "../../services/account";

function* updateRecommendationRequestHandler() {
  try {
    const userId = yield select(state => state.firebase.auth.uid);
    yield call(accountService.authTimeUpdate, userId);
  } catch (err) {
    console.error(err);
  }
}

export default [
  function* watchUpdateRecommendationRequest() {
    yield takeLatest(UPDATE_RECOMMENDATION, updateRecommendationRequestHandler);
  }
];
