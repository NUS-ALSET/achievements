import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import ProblemsTable from "../ProblemsTable";
import Button from "@material-ui/core/Button";
import sinon from "sinon";

describe("<ProblemsTable>", () => {
  let shallow;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow({
      dive: true
    });
  });

  it("should generate row", () => {
    const wrapper = shallow(
      <ProblemsTable
        dispatch={mockDispatch}
        problems={[
          {
            id: "test",
            name: "Test"
          }
        ]}
      />
    );

    wrapper
      .find(Button)
      .at(1)
      .simulate("click");
    expect(
      mockDispatch.calledWith({
        type: "PATH_PROBLEM_DIALOG_SHOW",
        problemInfo: {
          id: "test",
          name: "Test"
        }
      })
    ).toEqual(true);
  });
});
