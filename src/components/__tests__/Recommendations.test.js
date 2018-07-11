import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import Recommendations from "../Recommendations";

describe("<Recommendations/>", () => {
  let shallow;
  beforeEach(() => {
    shallow = createShallow();
  });

  it("Should test Recommendations component", () => {
    const rec = [
      {
        problem: null,
        path: null,
        video: null,
        feature: null,
        featureType: null
      }
    ];
    const component = shallow(<Recommendations recs={rec} title={""} />);
    expect(component).toMatchSnapshot();
  });
});
