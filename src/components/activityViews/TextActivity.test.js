import React from "react";
import { createMount } from "@material-ui/core/test-utils";
import TextActivity from "./TextActivity";
import sinon from "sinon";

describe("<TextActivity />", () => {
  let props = {
    onChange: sinon.spy(),
    readOnly: false,
    setProblemOpenTime: sinon.spy(),
    problem: {
      code: 1,
      question: "test question",
      description: "dummy description",
      fronzen: 1,
      owner: "I9nQZbQ5xMdklnudDqGfh1ucOZz2",
      path: "-LKe6K_c8h-g7nnfREc6",
      pathId: "-LKe6K_c8h-g7nnfREc6",
      pathName: "test pathname",
      problemId: "LKe_rbtMrzSW5E3Swz9",
      solved: false,
      type: "text"
    },
    solution: {
      value: "testing 123"
    }
  };
  let mount = createMount();
  it("Test onChangeSolution", () => {
    let component = mount(<TextActivity {...props} />);
    component.instance().onChangeSolution({ target: { value: "dummy" } });
    expect(props.setProblemOpenTime.calledOnce).toEqual(true);
    expect(props.onChange.calledWith({ value: "dummy" })).toEqual(true);
  });
});
