import { appFrame as reducer, initialState } from "./reducer";
import * as actions from "./actions";

describe("AppFrame reducer", () => {
  it("should return the initial state when initialize store", () => {
    expect(reducer(undefined, {})).toEqual({
      dropdownAnchorElId: false,
      mainDrawerOpen: false,
      dynamicPathTitle: "",
      promocode:""
    });
  });

  it("can activate dropdown menu when open login menu", () => {
    expect(
      reducer(undefined, {
        type: actions.LOGIN_MENU_OPEN,
        anchorElId: true
      })
    ).toEqual({
      ...initialState,
      dropdownAnchorElId: true
    });
  });

  it("can close login menu", () => {
    expect(
      reducer(undefined, {
        type: actions.LOGIN_MENU_CLOSE
      })
    ).toEqual({
      ...initialState,
      dropdownAnchorElId: false
    });
  });

  it("toggles the main drawer status", () => {
    expect(
      reducer(initialState, {
        type: actions.MAIN_DRAWER_TOGGLE,
        status: undefined
      })
    ).toEqual({
      ...initialState,
      mainDrawerOpen: true
    });
    expect(
      reducer(initialState, {
        type: actions.MAIN_DRAWER_TOGGLE,
        status: false
      })
    ).toEqual({
      ...initialState,
      mainDrawerOpen: false
    });
  });

  it("can get the pathname from the route", () => {
    expect(
      reducer(undefined, {
        type: actions.GET_DYNAMIC_PATHTITLE,
        pathname: "/User/12345"
      })
    ).toEqual({
      ...initialState,
      dynamicPathTitle: "User"
    });
    expect(
      reducer(undefined, {
        type: actions.GET_DYNAMIC_PATHTITLE,
        pathname: "/cohort/12345"
      })
    ).toEqual({
      ...initialState,
      dynamicPathTitle: "Cohort"
    });
    expect(
      reducer(undefined, {
        type: actions.GET_DYNAMIC_PATHTITLE,
        pathname: "/"
      })
    ).toEqual({
      ...initialState,
      dynamicPathTitle: "Achievements"
    });
    expect(
      reducer(undefined, {
        type: actions.GET_DYNAMIC_PATHTITLE,
        pathname: undefined
      })
    ).toEqual({
      ...initialState,
      dynamicPathTitle: "getting the title"
    });
  });
  it("can save promo code", () => {
    expect(
      reducer(undefined, {
        type: actions.SAVE_PROMO_CODE,
        code: "abc"
      })
    ).toEqual({
      ...initialState,
      promocode: "abc"
    });
  });
});
