import React from "react";
import sinon from "sinon";

import { createShallow } from "@material-ui/core/test-utils";
import Button from "@material-ui/core/Button";

import { Activity } from "../Activity";
import ActivityView from "../../../components/activityViews/ActivityView";

describe("<Activity>", () => {
  let shallow;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(<Activity match={{ params: {} }} />);

    expect(wrapper).toMatchSnapshot();
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
      />
    );

    expect(wrapper.state("problemSolution"), {});
    wrapper.find(ActivityView).simulate("problem-change", "test");
    expect(wrapper.state("problemSolution"), "test");
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
      />
    );

    wrapper.setState({
      problemSolution: "test"
    });
    wrapper.find(Button).simulate("click");

    expect(mockDispatch.calledOnce);
  });
});
