import React from "react";
import sinon from "sinon";
import { createMount } from "@material-ui/core/test-utils";
import Skills from "../Skills";
import { isThisHour } from "date-fns";

describe("<Skills />", () => {
  let mount;
  beforeEach(() => {
    mount = createMount();
  });
  it("test Skills functional component would render given props", () => {
    const props = {
      classes: {
        root: "classesRoot",
        heading1: "classesHeading1",
        demo: "classesDemo"
      },
      skills: { a: { skillA: "skillA" }, b: { skillB: "skillB" } }
    };
    const skillsComp = mount(<Skills {...props} />);
  });
});
