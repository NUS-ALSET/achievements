import React from "react";
import sinon from "sinon";
import { createShallow, createMount } from "@material-ui/core/test-utils";
import { UserSolutionRow } from "../UserSolutionRow";

describe("<UserSolutionRow />", () => {
  let shallow, mockDispatch;
  beforeEach(() => {
    shallow = createMount();
    mockDispatch = sinon.spy();
  });

  it("Should test getSolution function without activity in props", () => {
    const props = {
      dispatch: mockDispatch,
      userId: "12345678910111213",
      pathName: "Default",
      status: false,
      //      activity: { type: "Text" },
      classes: {},
      solution: { solution: "Test text solution", updatedAt: new Date() }
    };
    const component = shallow(<UserSolutionRow {...props} />);
    const text_sol = component.instance().getSolution(props.solution);
    expect(text_sol).toEqual("Test text solution");
  });
  it("Should test getSolution function with activity in props", () => {
    const props = {
      dispatch: mockDispatch,
      userId: "12345678910111213",
      pathName: "Default",
      status: false,
      activity: { type: "jupyterInline" },
      classes: {},
      solution: {
        solution: '{ "test": "Test text solution" }',
        updatedAt: new Date()
      }
    };
    //parse json
    const component = shallow(<UserSolutionRow {...props} />);
    const text_sol = component.instance().getSolution(props.solution);
    expect(text_sol).toEqual({ test: "Test text solution" });
  });
});
