import * as actions from "./actions"


describe("Root action creators should create an action to", () => {
  it("show notification with message", () => {
    const expectedAction = {
      type: actions.NOTIFICATION_SHOW,
      message: "HELLO!"
    }
    expect(actions.notificationShow("HELLO!")).toEqual(expectedAction)
  })
  it("hide notification", () => {
    expect(
      actions.notificationHide()
    ).toEqual(
      { type: actions.NOTIFICATION_HIDE }
    )
  })
  it("request sign-in", () => {
    expect(
      actions.signInRequest()
    ).toEqual(
      { type: actions.SIGN_IN_REQUEST }
    )
  })
  it("indicate successful sign-in", () => {
    expect(
      actions.signInSuccess()
    ).toEqual(
      { type: actions.SIGN_IN_SUCCESS }
    )
  })
  it("request for sign-out", () => {
    expect(
      actions.signOutRequest()
    ).toEqual(
      { type: actions.SIGN_OUT_REQUEST }
    )
  })
  it("indicate successful sign-out", () => {
    expect(
      actions.signOutSuccess()
    ).toEqual(
      { type: actions.SIGN_OUT_SUCCESS }
    )
  })
  it("request to accept EULA", () => {
    expect(
      actions.acceptEulaRequest()
    ).toEqual(
      { type: actions.ACCEPT_EULA_REQUEST }
    )
  })
  it("indicate successfully accepted EULA", () => {
    expect(
      actions.acceptEulaSuccess()
    ).toEqual(
      { type: actions.ACCEPT_EULA_SUCCESS }
    )
  })
  it("indicate failure to accept EULA", () => {
    expect(
      actions.acceptEulaFail()
    ).toEqual(
      { type: actions.ACCEPT_EULA_FAIL }
    )
  })
  it("show the EULA dialog", () => {
    expect(
      actions.showAcceptEulaDialog()
    ).toEqual(
      { type: actions.SHOW_ACCEPT_EULA_DIALOG }
    )
  })
  it("indicate a change in route", () => {
    expect(
      actions.routeChange("/path", "POP")
    ).toEqual(
      {
        type: actions.ROUTE_CHANGE,
        pathname: "/path",
        method: "POP"
      }
    )
  })
  it("indicate a change in app version by comparing the package.json and firebase's config node", () => {
    const expectedAction = {
      type: actions.VERSION_CHANGE,
      needRefresh: true
    }
    expect(actions.versionChange(true)).toEqual(expectedAction)
  })
  it("show a Sign-In required to continue using the app", () => {
    expect(
      actions.signInRequire()
    ).toEqual(
      { type: actions.SIGN_IN_REQUIRE }
    )
  })
})