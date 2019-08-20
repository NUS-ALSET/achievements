import { AppFrame } from "./AppFrame";
import sinon from "sinon";
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import {
  loginMenuClose,
  loginMenuOpen,
  mainDrawerToggle,
  routeChanged,
  getDynamicPathtitle,
  savePromoCode
} from "./actions";
import { signInRequest, signOutRequest } from "../Root/actions";

describe("<AppFrame />", () => {
  let shallow, mockDispatch;
  shallow = createShallow();
  mockDispatch = sinon.spy();
  const props = {
    dispatch: mockDispatch,
    anchorElId: false,
    classes: {
      appBar: "Connect-AppFrame--appBar-27",
      appBarTitle: "Connect-AppFrame--appBarTitle-25",
      appFrame: "Connect-AppFrame--appFrame-26",
      content: "Connect-AppFrame--content-29",
      drawer: "Connect-AppFrame--drawer-28",
      root: "Connect-AppFrame--root-24"
    },
    mainDrawerOpen: true,
    userId: "1r22OQHB2gODibu0zVMsYMqcCMA2",
    isAdmin: true,
    dynamicPathTitle: "Achievements",
    routerPathname: "/",
    history: {
      length: 4,
      action: "POP",
      location: { pathname: "/" }
    }
  };

  let component;
  beforeEach(() => {
    component = shallow(<AppFrame {...props} />);
  });

  global.window = Object.create(window);
  const url = "http://test_url?testcode/#/";
  Object.defineProperty(window, "location", {
    value: {
      href: url
    }
  });
  it("should test componenetDidMount dispatch promocode", () => {
    expect(mockDispatch.calledWith(savePromoCode("testcode"))).toEqual(true);
  });

  it("Should test saveRouteChange method dispatching", () => {
    // test saveRoutesChange
    component.instance().saveRoutesChange("dummy_path");
    expect(mockDispatch.calledWith(routeChanged("dummy_path"))).toEqual(true);
  });

  it("should test handleDrawerClose", () => {
    component.instance().handleDrawerClose();
    expect(mockDispatch.calledWith(mainDrawerToggle(false))).toEqual(true);
  });

  it("should test handleDrawerToggle", () => {
    component.instance().handleDrawerToggle();
    expect(mockDispatch.calledWith(mainDrawerToggle())).toEqual(true);
  });

  it("should test handleMenuOpen", () => {
    component.instance().handleMenuOpen({ currentTarget: { id: true } });
    expect(mockDispatch.calledWith(loginMenuOpen(true))).toEqual(true);
  });

  it("should test handleMenuClose", () => {
    component.instance().handleMenuClose();
    expect(mockDispatch.calledWith(loginMenuClose())).toEqual(true);
  });

  it("should test handleLogin", () => {
    component.instance().handleLogin();
    expect(mockDispatch.calledWith(signInRequest())).toEqual(true);
  });

  it("should test handleLogout", () => {
    component.instance().handleLogout();
    expect(mockDispatch.calledWith(signOutRequest())).toEqual(true);
  });

  it("should test componentDidUpdate", () => {
    component.setProps({ ...props, routerPathname: "/dummy" });
    expect(
      mockDispatch.calledWith(
        getDynamicPathtitle(props.history.location.pathname)
      )
    ).toEqual(true);
  });
});
