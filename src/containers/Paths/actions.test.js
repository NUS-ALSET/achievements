import * as actions from "./actions"


describe("Paths action creators should create an action to", () => {
  it("switch tabs in PathTabs", () => {
    const expectedAction = {
      type: actions.PATH_TAB_SWITCH,
      tabIndex: 1
    }
    expect(actions.switchPathTab(1)).toEqual(expectedAction)
  })
})