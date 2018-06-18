/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";

import sinon from "sinon";

import JupyterProblem from "../JupyterProblem";
import JupyterNotebook from "../JupyterNotebook";
import { PROBLEM_SOLVE_UPDATE } from "../../../containers/Problem/actions";

describe("<JupyterProblem>", () => {
  let mockDispatch;
  let shallow;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(
      <JupyterProblem
        dispatch={mockDispatch}
        problem={{ pathId: "testPath", problemId: "testProblem" }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should initiate JupyterProblem w/o solution", () => {
    const wrapper = shallow(
      <JupyterProblem
        dispatch={mockDispatch}
        problem={{
          id: "testProblem",
          problemJSON: {
            foo: "bar"
          }
        }}
      />
    );

    expect(wrapper.find(JupyterNotebook).length).toEqual(2);
    wrapper.update();

    const solutionNotebook = wrapper.find(JupyterNotebook).at(0);
    const problemNotebook = wrapper.find(JupyterNotebook).at(1);

    expect(solutionNotebook.prop("persistent")).toEqual(true);
    expect(solutionNotebook.prop("title")).toEqual("Calculated Solution");
    expect(problemNotebook.props()).toEqual({
      solution: { json: { foo: "bar" } },
      title: "Problem"
    });
  });

  it("should initiate JupyterProblem with solution", () => {
    const wrapper = shallow(
      <JupyterProblem
        dispatch={mockDispatch}
        problem={{
          id: "testProblem",
          problemJSON: {
            foo: "bar"
          }
        }}
        solution={{
          json: "test",
          provided: "providedSolution"
        }}
      />
    );

    expect(wrapper.find(JupyterNotebook).length).toEqual(3);
    wrapper.update();

    const solutionNotebook = wrapper.find(JupyterNotebook).at(0);
    const providedNotebook = wrapper.find(JupyterNotebook).at(1);
    const problemNotebook = wrapper.find(JupyterNotebook).at(2);

    expect(solutionNotebook.prop("persistent")).toEqual(true);
    expect(solutionNotebook.prop("title")).toEqual("Calculated Solution");
    expect(solutionNotebook.prop("solution")).toEqual({
      json: "test",
      provided: "providedSolution"
    });

    expect(providedNotebook.prop("title")).toEqual("Provided Solution");
    expect(providedNotebook.prop("solution")).toEqual({
      json: "providedSolution"
    });

    expect(problemNotebook.props()).toEqual({
      solution: { json: { foo: "bar" } },
      title: "Problem"
    });
  });

  it("should dispatch problemSolutionSubmitRequest", () => {
    const mockChange = sinon.spy();
    const wrapper = shallow(
      <JupyterProblem
        dispatch={mockDispatch}
        onChange={mockChange}
        problem={{ pathId: "testPath", problemId: "testProblem" }}
      />
    );
    wrapper.instance().onSolutionRefreshClick("test");
    expect(mockChange.calledWith("test")).toEqual(true);
    expect(
      mockDispatch.calledWith({
        type: PROBLEM_SOLVE_UPDATE,
        pathId: "testPath",
        problemId: "testProblem",
        fileId: "test"
      })
    ).toEqual(true);
  });
});
