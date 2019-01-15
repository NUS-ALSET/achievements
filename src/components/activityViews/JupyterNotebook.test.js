import React from "react";

import { createShallow } from "@material-ui/core/test-utils";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import sinon from "sinon";

import JupyterNotebook from "./JupyterNotebook";

describe("<JupyterNotebook>", () => {
  let spy;
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
    spy = sinon.spy();
  });

  it("should change internal state", () => {
    const wrapper = shallow(
      <JupyterNotebook action={spy} solution={false} title="test" />
    );

    expect(wrapper.state("solution")).toEqual("");
    wrapper.find(TextField).simulate("change", { target: { value: "test" } });
    expect(wrapper.state("solution")).toEqual("test");
  });

  it("shouldn't be collapsible", () => {
    const wrapper = shallow(<JupyterNotebook persistent={true} title="test" />);

    expect(wrapper.find(IconButton).length).toEqual(0);
  });

  it("should change collapsed state", () => {
    const wrapper = shallow(<JupyterNotebook title="test" />);

    expect(wrapper.state("collapsed")).toEqual(false);
    expect(wrapper.find(IconButton).length).toEqual(1);
    wrapper.find(IconButton).simulate("click");
    expect(wrapper.state("collapsed")).toEqual(true);
  });
});
