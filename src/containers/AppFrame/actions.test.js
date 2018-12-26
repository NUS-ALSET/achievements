import * as actions from "./actions";

describe("AppFrame actions", () => {
  it("should create an action to open login menu", () => {
    const anchorElId = true;
    const expectedAction = {
      type: actions.LOGIN_MENU_OPEN,
      anchorElId
    };
    expect(actions.loginMenuOpen(anchorElId)).toEqual(expectedAction);
  });

  it("should create an action to close login menu", () => {
    const expectedAction = {
      type: actions.LOGIN_MENU_CLOSE
    };
    expect(actions.loginMenuClose()).toEqual(expectedAction);
  });

  it("should create an action to toggle main drawer status", () => {
    const expectedAction = {
      type: actions.MAIN_DRAWER_TOGGLE,
      status: undefined
    };
    expect(actions.mainDrawerToggle()).toEqual(expectedAction);
  });

  it("should create an action to get the pathname from the route", () => {
    const expectedAction = {
      type: actions.GET_DYNAMIC_PATHTITLE,
      pathname: "/User/12345"
    };
    expect(actions.getDynamicPathtitle("/User/12345")).toEqual(expectedAction);
  });
});
