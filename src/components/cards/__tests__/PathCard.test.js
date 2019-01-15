import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import Typography from "@material-ui/core/Typography";
import PathCard from "../PathCard";

describe("<PathCard />", () => {
  let shallow;
  beforeEach(() => {
    shallow = createShallow();
  });

  it("Should test Typography into PathCard component", () => {
    const component = shallow(<PathCard title={"test"} />);
    const typographys = component.find(Typography);
    expect(typographys.length).toEqual(1);
  });
});
