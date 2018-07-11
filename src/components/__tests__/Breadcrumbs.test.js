import React from "react";
import { createMount, createShallow } from "@material-ui/core/test-utils";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "../Breadcrumbs";

describe("<Breadcrumbs>", () => {
  let mount;
  let shallow;
  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
  });

  it("Should test Breadcrumbs component", () => {
    const component = shallow(
      <Breadcrumbs actions={{}} paths={[]} />
    );
    expect(component).toMatchSnapshot();
  });

  it("Should render Button into Breadcrumbs component", () => {
    const component = mount(
      <Breadcrumbs action={{ handler: () => {}, label: "Test" }} paths={[]} />
    );
    expect(component.find(Button).length).toEqual(1);
  });

  it("Should not render Button into Breadcrumbs component", () => {
    const component = mount(<Breadcrumbs paths={[]} />);
    expect(component.find(Button).length).toEqual(0);
  });
});
