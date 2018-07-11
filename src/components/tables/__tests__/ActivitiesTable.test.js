/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";

import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";

import ActivitiesTable from "../ActivitiesTable";

describe("<ActivitiesTable>", () => {
  let shallow;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow({
      dive: true
    });
  });

  it("should generate row for owner", () => {
    const wrapper = shallow(
      <ActivitiesTable
        currentUserId="abcd"
        onEditProblem={mockDispatch}
        onOpenProblem={mockDispatch}
        pathOwnerId="abcd"
        problems={[
          {
            id: "test",
            name: "Test"
          }
        ]}
      />
    );

    expect(wrapper.find(TableHead).find(TableCell).length).toEqual(3);

    expect(wrapper.find(Button).length).toEqual(2);
    wrapper
      .find(Button)
      .at(1)
      .simulate("click");
    expect(
      mockDispatch.calledWith({
        id: "test",
        name: "Test"
      })
    ).toEqual(true);
  });

  it("should generate row w/o edit button", () => {
    const wrapper = shallow(
      <ActivitiesTable
        currentUserId="abcd"
        onEditProblem={mockDispatch}
        onOpenProblem={mockDispatch}
        pathOwnerId="efgh"
        problems={[
          {
            id: "test",
            name: "Test"
          }
        ]}
      />
    );

    expect(wrapper.find(TableHead).find(TableCell).length).toEqual(4);
    expect(wrapper.find(Button).length).toEqual(1);
  });
});
