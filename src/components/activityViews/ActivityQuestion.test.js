import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import ActivityQuestion from "./ActivityQuestion";
import sinon from "sinon";

describe("<ActivityQuestion>", () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it("should set label for problem question", () => {
    const wrapper = shallow(
      <ActivityQuestion
        label="testLabel"
        question="test"
        setAnswer={() => {}}
      />
    );

    expect(wrapper.prop("label")).toEqual("testLabel");
  });

  it("should set predefined label for problem question", () => {
    const wrapper = shallow(
      <ActivityQuestion question="topics" setAnswer={() => {}} />
    );

    expect(wrapper.prop("label")).toEqual(
      "What topics were covered in this video? Put each topic on a new line"
    );
  });

  it("should check change event", () => {
    let spy = sinon.spy();
    const wrapper = shallow(
      <ActivityQuestion question="topics" setAnswer={spy} />
    );

    wrapper.simulate("change", {
      target: {
        value: 1
      }
    });
    expect(spy.calledWith("topics", 1)).toEqual(true);
  });
});
