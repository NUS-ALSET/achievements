import React from "react";
import sinon from "sinon";
import { createShallow } from "@material-ui/core/test-utils";
import PathsList from "../PathsList";

describe("<PathsList />", () => {
  let shallow, mockDispatch;
  beforeEach(() => {
    shallow = createShallow();
    mockDispatch = sinon.spy();
  });

  it("Should test selectPath function of PathsList component", () => {
    const props = {
      dispatch: mockDispatch,
      header: "",
      paths: { a: "a", b: "b", c: "c" },
      selectedPathId: "",
      userId: ""
    };
    const component = shallow(<PathsList {...props} />);
    component.instance().selectPath("test");
    expect(
      mockDispatch.calledWith({
        type: "PATH_SELECT",
        pathId: "test"
      })
    ).toEqual(true);
  });
});
