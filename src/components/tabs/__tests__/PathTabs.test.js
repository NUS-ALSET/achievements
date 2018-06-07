import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";

import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";

import PathTabs from "../PathTabs";
import PathsTable from "../../tables/PathsTable";
import { PATH_DIALOG_SHOW } from "../../../containers/Paths/actions";

describe("<PathTabs>", () => {
  let shallow;
  let mockDispatch;

  beforeEach(() => {
    shallow = createShallow();
    mockDispatch = sinon.spy();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(<PathTabs dispatch={mockDispatch} myPaths={{}} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("should change tab", () => {
    const wrapper = shallow(<PathTabs dispatch={mockDispatch} myPaths={{}} />);

    expect(wrapper.state("currentTab"), 0);
    wrapper.find(Tabs).simulate("change", {}, 1);
    expect(wrapper.state("currentTab"), 1);
  });

  it("should render correct paths", () => {
    const myPaths = { foo: "bar" };
    const joinedPaths = { dead: "beef" };
    const publicPaths = { cafe: "babe" };
    let wrapper = shallow(
      <PathTabs
        dispatch={mockDispatch}
        joinedPaths={joinedPaths}
        myPaths={myPaths}
        publicPaths={publicPaths}
      />
    );
    let pathsTable;
    wrapper.setState({ currentTab: 2 });
    wrapper.update();
    pathsTable = wrapper.find(PathsTable);
    expect(pathsTable.prop("paths")).toEqual(publicPaths);
    expect(pathsTable.prop("owner")).toEqual(false);
    wrapper.setState({ currentTab: 1 });
    wrapper.update();
    pathsTable = wrapper.find(PathsTable);
    expect(pathsTable.prop("paths")).toEqual(myPaths);
    wrapper.setState({ currentTab: 0 });
    wrapper.update();
    pathsTable = wrapper.find(PathsTable);
    expect(pathsTable.prop("paths")).toEqual(joinedPaths);
    expect(pathsTable.prop("owner")).toEqual(false);
  });

  it("should throw error", () => {
    const wrapper = shallow(<PathTabs dispatch={mockDispatch} myPaths={{}} />);

    expect(() => wrapper.setState({ currentTab: 3 })).toThrow(
      "Wrong tab index"
    );
  });

  it("should dispatch action", () => {
    const wrapper = shallow(<PathTabs dispatch={mockDispatch} myPaths={{}} />);

    wrapper.find(Button).simulate("click");
    expect(
      mockDispatch.calledWith({
        type: PATH_DIALOG_SHOW
      })
    );
  });
});
