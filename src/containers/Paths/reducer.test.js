import { paths as reducer } from "./reducer"
import * as actions from "./actions"


const initState = {
  selectedPathId: "",
  currentPathTab: 0,
  joinedPaths: {},
  ui: {
    dialog: {
      type: ""
    }
  }
}

describe("Paths container reducer", () => {
  it("should return the initial state during initialization", () => {
    expect(reducer(undefined, {})).toEqual(
      initState
    )
  })
  it("should handle PATH_TAB_SWITCH and update currentPathTab", () => {
    expect(
      reducer(initState, {
        type: actions.PATH_TAB_SWITCH,
        tabIndex: 2
      })
    ).toEqual(
      {
        ...initState,
        currentPathTab: 2
      }
    )
  })
})