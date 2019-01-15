import { root as reducer } from "./reducer"
import * as actions from "./actions"


const initState = {
  requireAcceptEULA: false,
  requireSignIn: false,
  needRefresh: false,
  notification: {
    show: false,
    message: ""
  }
}
describe("Root container reducer", () => {
  it("should return the initial state during initialization", () => {
    expect(reducer(undefined, {})).toEqual(
      initState
    )
  })
  it("should handle SHOW_ACCEPT_EULA_DIALOG and switch on requireAcceptEULA", () => {
    expect(
      reducer(initState, {
        type: actions.SHOW_ACCEPT_EULA_DIALOG
      })
    ).toEqual(
      {
        ...initState,
        requireAcceptEULA: true
      }
    )
  })
  it("should handle SIGN_IN_REQUIRE and switch on requireSignIn", () => {
    expect(
      reducer(initState, {
        type: actions.SIGN_IN_REQUIRE
      })
    ).toEqual(
      {
        ...initState,
        requireSignIn: true
      }
    )
  })
  it("should handle VERSION_CHANGE and store needRefresh state", () => {
    expect(
      reducer(initState, {
        type: actions.VERSION_CHANGE,
        needRefresh: true
      })
    ).toEqual(
      {
        ...initState,
        needRefresh: true
      }
    )
  })
  it("should handle NOTIFICATION_SHOW/HIDE", () => {
    expect(
      reducer(initState, {
        type: actions.NOTIFICATION_SHOW,
        message: "LOOK HERE!"
      })
    ).toEqual(
      {
        ...initState,
        notification: {
          show: true,
          message: "LOOK HERE!"
        }
      }
    )
    expect(
      reducer(
        {
          ...initState,
          notification: {
            show: true,
            message: "HELLO!"
          }
        },
        { type: actions.NOTIFICATION_HIDE }
      )
    ).toEqual(
      {
        ...initState,
        notification: {
          show: false,
          message: ""
        }
      }
    )
  })
})