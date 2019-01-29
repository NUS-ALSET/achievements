import {
  handleSignInRequest,
  handleSignOut
 } from "./sagas"
import * as actions from "./actions"
import { put, call } from "redux-saga/effects"
import assert from "assert"
import { accountService } from "../../services/account"
import { runSaga } from "redux-saga";


describe("Root sagas", () => {
  it("handle sign-in request", () => {
    const generator = handleSignInRequest()
    assert.deepEqual(
      generator.next().value,
      call(accountService.signIn),
      "it should wait for accountService to call signIn"
    )
    assert.deepEqual(
      generator.next().value,
      put(actions.signInSuccess()),
      "it should wait for signInSuccess action to be dispatched"
    )
    assert.deepEqual(
      generator.next().value,
      put(actions.notificationShow("Successfully signed in")),
      "it should wait for notificationShow action"
    )
  })

  it("handle sign-out request", async () => {
    const dispatchedActions = [];

    accountService.signOut = jest.fn(() => Promise.resolve());

    const fakeStore = {
      dispatch: action => dispatchedActions.push(action)
    };

    await runSaga(
      fakeStore,
      handleSignOut
    ).done;

    expect(dispatchedActions).toEqual(
      [
        { type: "SIGN_OUT_SUCCESS" },
        {
          type: "NOTIFICATION_SHOW",
          message: "You have signed out"
        }
      ]
    )
  })
})