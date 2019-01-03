import { handleSignInRequest } from "./sagas"
import * as actions from "./actions"
import { put, call } from "redux-saga/effects"
import assert from "assert"
import { accountService } from "../../services/account"


/* Although it may be useful to test each step of a saga, in practise this makes for brittle tests. 
 * Instead, it may be preferable to run the whole saga and assert that the expected effects have occurred.
 */
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
})