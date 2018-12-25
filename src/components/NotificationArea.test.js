import React from "react";
import NotificationArea from "./NotificationArea";
import IconButton from "@material-ui/core/IconButton";
import Enzyme, { shallow, render, mount } from "enzyme";
import sinon from "sinon";

describe("<NotificationArea>", () => {
  it("renders message prop correctly", () => {
    const wrapper = shallow(
      <NotificationArea
        handleClose={() => {}}
        message={"notification test"}
        open={true}
      />
    );

    expect(wrapper.prop("message")).toEqual(<span>notification test</span>);
  });

  it("calls handleClose on click", () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <NotificationArea
        handleClose={spy}
        message={"notification test"}
        open={true}
      />
    );
    wrapper.find(IconButton).simulate("click");
    expect(spy.calledOnce).toBe(true);
  });
});
