import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import AssignmentsTable from "../AssignmentsTable";
import sinon from "sinon";

describe("<AssignmentsTable>", () => {
  let shallow;
  let dispatch;

  beforeEach(() => {
    shallow = createShallow();
    dispatch = sinon.spy();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(
      <AssignmentsTable dispatch={dispatch} isInstructor={false} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
