import React from "react";
import sinon from "sinon";
import { createShallow } from "@material-ui/core/test-utils";
import { UserSolutionRow } from "../UserSolutionRow";

describe("<UserSolutionRow />", () => {
  let shallow, mockDispatch;
  beforeEach(() => {
    shallow = createShallow();
    mockDispatch = sinon.spy();
  });

  it("Should test getSolution function with string solution", () => {
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
});
