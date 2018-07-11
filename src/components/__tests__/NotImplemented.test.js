import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import NotImplemented from "../NotImplemented";

describe("<NotImplemented />", () => {
  let shallow;
  beforeEach(() => {
    shallow = createShallow();
  });

  it("Should test NotImplemented component", () => {
    const component = shallow(<NotImplemented />);
    expect(component).toMatchSnapshot();
  });
});
