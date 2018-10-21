import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import CohortTabs from "../CohortTabs";
import Tabs from "@material-ui/core/Tabs";

describe("<CohortTabs>", () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it("should create CohortTabs", () => {
    const spy = jest.fn();
    const wrapper = shallow(<CohortTabs onChange={spy} tabIndex={0} />);
    const tabs = wrapper.find(Tabs);
    tabs.simulate("change");
    expect(tabs.prop("value")).toBe(0);
    expect(spy.mock.calls.length).toBe(1);
  });
});
