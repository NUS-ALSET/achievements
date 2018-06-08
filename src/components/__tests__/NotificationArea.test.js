import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import NotificationArea from "../NotificationArea";

describe("<NotificationArea>", () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it("Should test Notification component", () => {
    const component = shallow(
      <NotificationArea handleClose={() => {}} message="test" open={true} />
    );

    expect(component).toMatchSnapshot();
  });

  it("Should render Notification message", () => {
    const component = shallow(
      <NotificationArea handleClose={() => {}} message="test" open={true} />
    );

    expect(component.prop("message")).toEqual(<span>test</span>);
  });
});
