import React from "react";
import sinon from "sinon";

import { createShallow } from "@material-ui/core/test-utils";
import Button from "@material-ui/core/Button";

import { Activity } from "../Activity";

describe("<Activity>", () => {
  let shallow;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow();
  });

  it("should update internal state", () => {
    const wrapper = shallow(
      <Activity
        dispatch={mockDispatch}
        match={{
          params: {
            pathId: "testPath"
          }
        }}
        pathProblem={{}}
        uid={"test"}
      >
        {() => {}}
      </Activity>
    );

    // expect(wrapper.state("problemSolution")).toEqual({});
    // wrapper.find(Button).simulate("problem-change", "test");
    // expect(wrapper.state("problemSolution")).toEqual("test");
  });

  it("should dispatch problemSolutionSubmitRequest", () => {
    const wrapper = shallow(
      <Activity
        dispatch={mockDispatch}
        match={{
          params: {
            pathId: "testPath",
            problemId: "testProblem"
          }
        }}
        pathProblem={{}}
        uid={"test"}
      >
        {() => {}}
      </Activity>
    );

    wrapper.setState({
      problemSolution: "test"
    });
    wrapper.find(Button).simulate("click");

    expect(mockDispatch.calledOnce);
  });
});
