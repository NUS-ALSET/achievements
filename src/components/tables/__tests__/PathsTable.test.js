/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";

import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";

import PathsTable from "../PathsTable";

describe("<PathsTable>", () => {
  let shallow;
  let mockDispatch;

  beforeEach(() => {
    shallow = createShallow();
    mockDispatch = sinon.spy();
  });

  it("should check snapshot", () => {
    // const wrapper = shallow(<PathsTable />);
    // expect(wrapper).toMatchSnapshot();
  });

  it("should generate table with 2 rows", () => {
    shallow = createShallow({
      dive: true
    });

    const wrapper = shallow(
      <PathsTable
        dispatch={mockDispatch}
        paths={{
          test1: {
            name: "test 1"
          },
          test2: {
            name: "test 2"
          }
        }}
      />
    );
    expect(wrapper.find(TableBody).find(TableRow).length).toEqual(2);
  });

  it("should dispatch path change action", () => {
    shallow = createShallow({
      dive: true
    });

    const wrapper = shallow(
      <PathsTable
        dispatch={mockDispatch}
        owner={true}
        paths={{ test1: { name: "test 1" } }}
      />
    );
    expect(wrapper.find(Button).length).toEqual(2);
    wrapper
      .find(Button)
      .at(1)
      .simulate("click");
    expect(
      mockDispatch.calledWith({
        type: "PATH_DIALOG_SHOW",
        pathInfo: {
          id: "test1",
          name: "test 1"
        }
      })
    );
  });

  it("should hide `edit` button", () => {
    shallow = createShallow({
      dive: true
    });

    const wrapper = shallow(
      <PathsTable
        dispatch={mockDispatch}
        paths={{ test1: { name: "test 1" } }}
      />
    );
    expect(wrapper.find(Button).length).toEqual(1);
  });
});
