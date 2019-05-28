/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";

import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";

import ActivitiesTable from "../ActivitiesTable";
import { TableBody, TableRow } from "@material-ui/core";

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
        activities={[
          {
            id: "test",
            name: "Test"
          }
        ]}
        currentUserId="abcd"
        onDeleteActivity={mockDispatch}
        onEditActivity={mockDispatch}
        onMoveActivity={mockDispatch}
        onOpenActivity={mockDispatch}
        pathStatus="owner"
      />
    );

    expect(wrapper.find(TableHead).find(TableCell).length).toEqual(4);

    expect(wrapper.find(Button).length).toEqual(2);
    // wrapper
    //   .find(Button)
    //   .at(1)
    //   .simulate("click");
    // expect(
    //   mockDispatch.calledWith({
    //     type: "ROUTE_CHANGE",
    //     pathname: "LEOF9q3V",
    //     method: "POP"
    //   })
    // ).toEqual(true);

    // wrapper
    //   .find(Button)
    //   .at(2)
    //   .simulate("click");

    // expect(
    //   mockDispatch.calledWith(
    //     {
    //       id: "test",
    //       name: "Test"
    //     },
    //     "up"
    //   )
    // ).toEqual(true);
    // wrapper
    //   .find(Button)
    //   .at(3)
    //   .simulate("click");
    // expect(
    //   mockDispatch.calledWith(
    //     {
    //       id: "test",
    //       name: "Test"
    //     },
    //     "down"
    //   )
    // ).toEqual(true);
  });

  it("should generate row w/o edit button", () => {
    const wrapper = shallow(
      <ActivitiesTable
        activities={[
          {
            id: "test",
            name: "Test"
          }
        ]}
        currentUserId="abcd"
        onDeleteActivity={mockDispatch}
        onEditActivity={mockDispatch}
        onMoveActivity={mockDispatch}
        onOpenActivity={mockDispatch}
        pathStatus="joined"
      />
    );

    expect(wrapper.find(TableHead).find(TableCell).length).toEqual(4);
    expect(wrapper.find(Button).length).toEqual(1);
  });
  it("should generate column for non-owner/colaborator", () => {
    const wrapper = shallow(
      <ActivitiesTable
        activities={[
          {
            id: "test",
            name: "Test"
          }
        ]}
        currentUserId="abcd"
        onDeleteActivity={mockDispatch}
        onEditActivity={mockDispatch}
        onMoveActivity={mockDispatch}
        onOpenActivity={mockDispatch}
        pathStatus="joined"
      />
    );

    expect(wrapper.find(TableHead).find(TableCell).length).toEqual(4);
    expect(
      wrapper
        .find(TableBody)
        .find(TableRow)
        .find(TableCell).length
    ).toEqual(4);
  });

  it("should open analysisDialog", () => {
    const wrapper = shallow(
      <ActivitiesTable
        activities={[
          {
            id: "test",
            name: "Test"
          }
        ]}
        currentUserId="abcd"
        onDeleteActivity={mockDispatch}
        onEditActivity={mockDispatch}
        onMoveActivity={mockDispatch}
        onOpenActivity={mockDispatch}
        pathStatus="joined"
      />
    );
    const componentInstance = wrapper.instance();
    componentInstance.openAnalysisDialog("r4rrr5f", "name");
    expect(wrapper.state("analysisDialog")).toEqual({
      open: true,
      name: "name",
      activityId: "r4rrr5f"
    });
  });

  it("should get acivity status", () => {
    const wrapper = shallow(
      <ActivitiesTable
        activities={[
          {
            id: "test",
            name: "Test",
            type: "profile"
          }
        ]}
        currentUserId="abcd"
        onDeleteActivity={mockDispatch}
        onEditActivity={mockDispatch}
        onMoveActivity={mockDispatch}
        onOpenActivity={mockDispatch}
        pathStatus="joined"
      />
    );
    const componentInstance = wrapper.instance();
    const status = componentInstance.getStatus({
      id: "test",
      name: "Test",
      type: "profile"
    });
    expect(status).toEqual(Boolean({}.id));
  });

  it("should render activities list", () => {
    const activities = [
      {
        id: "test",
        name: "Test",
        type: "profile"
      },
      {
        id: "test2",
        name: "Test2",
        type: "profile"
      }
    ];
    const wrapper = shallow(
      <ActivitiesTable
        activities={activities}
        currentUserId="abcd"
        onDeleteActivity={mockDispatch}
        onEditActivity={mockDispatch}
        onMoveActivity={mockDispatch}
        onOpenActivity={mockDispatch}
        pathStatus="joined"
      />
    );

    // Expect the wrapper object to be defined
    expect(wrapper.find(TableBody)).toBeDefined();
    expect(wrapper.find(TableBody).find(TableRow)).toHaveLength(
      activities.length
    );
  });
});
