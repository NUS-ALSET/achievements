import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import PathTabs from "../PathTabs";
import sinon from "sinon";
import {
  PATHS_TAB_PUBLIC,
  PATHS_TAB_OWNED,
  PATHS_TAB_JOINED
} from "../PathTabs";

describe("<PathTabs >", () => {
  const mount = createShallow();
  let props = {
    pathDialogShow: sinon.spy(),
    joinedPaths: {},
    myPaths: {},
    publicPaths: {},
    uid: "1r22OQHB2gODibu0zVMsYMqcCMA2",
    currentPathTab: PATHS_TAB_OWNED,
    handleSwitchPathTab: sinon.spy(),
    pathStats: {}
  };
  let component;
  it("should test onAddPathClick", () => {
    component = mount(<PathTabs {...props} />);
    expect(props.pathDialogShow.notCalled).toEqual(true);
    component.instance().onAddPathClick();
    expect(props.pathDialogShow.calledOnce).toEqual(true);
  });
  it("should test handleTabChange", () => {
    component = mount(<PathTabs {...props} />);
    expect(props.handleSwitchPathTab.notCalled).toEqual(true);
    component.instance().handleTabChange({}, PATHS_TAB_JOINED);
    expect(props.handleSwitchPathTab.calledOnce).toEqual(true);
  });
  it("should test loading component with different currentPathTab indexes", () => {
    component = mount(
      <PathTabs {...{ ...props, currentPathTab: PATHS_TAB_JOINED }} />
    );
    component = mount(
      <PathTabs {...{ ...props, currentPathTab: PATHS_TAB_PUBLIC }} />
    );
    expect(() =>
      mount(<PathTabs {...{ ...props, currentPathTab: undefined }} />)
    ).toThrowError();
  });
});
