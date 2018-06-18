import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import ProblemQuestion from "../ProblemQuestion";
import sinon from "sinon";

describe("<ProblemQuestion>", () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(
      <ProblemQuestion question="test" setAnswer={() => {}} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("should set label for problem question", () => {
    const wrapper = shallow(
      <ProblemQuestion label="testLabel" question="test" setAnswer={() => {}} />
    );

    expect(wrapper.prop("label")).toEqual("testLabel");
  });

  it("should set predefined label for problem question", () => {
    const wrapper = shallow(
      <ProblemQuestion question="topics" setAnswer={() => {}} />
    );

    expect(wrapper.prop("label")).toEqual(
      "What topics were covered in this video? Put each topic on a new line"
    );
  });

  it("should check change event", () => {
    let spy = sinon.spy();
    const wrapper = shallow(
      <ProblemQuestion question="topics" setAnswer={spy} />
    );

    wrapper.simulate("change", {
      target: {
        value: 1
      }
    });
    expect(spy.calledWith("topics", 1)).toEqual(true);
  });
});
