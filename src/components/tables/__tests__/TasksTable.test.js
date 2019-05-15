/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";
import TasksTable from "../TasksTable";
import { TableBody, TableRow } from "@material-ui/core";

describe("<TasksTable>", () => {
  let shallow;
  let mockDispatch;
  let tasks;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow({
      dive: true
    });
    tasks = {
      task1: {},
      task2: {}
    };
  });

  it("renders correctly when there are multiple tasks", () => {
    const tree = renderer
      .create(
        <Router>
          <TasksTable onDeleteClick={mockDispatch} tasks={tasks} />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should render empty list", () => {
    const wrapper = shallow(
      <TasksTable onDeleteClick={mockDispatch} tasks={{}} />
    );

    expect(wrapper.find(TableBody).find(TableRow).length).toEqual(1);
  });

  it("should render tasks list", () => {
    const wrapper = shallow(
      <TasksTable onDeleteClick={mockDispatch} tasks={tasks} />
    );

    // Expect the wrapper object to be defined
    expect(wrapper.find(TableBody)).toBeDefined();
    expect(wrapper.find(TableBody).find(TableRow)).toHaveLength(
      Object.keys(tasks).length
    );
  });

  it("should render tasks without throwing", () => {
    const wrapper = shallow(
      <TasksTable onDeleteClick={mockDispatch} tasks={tasks} />
    );

    // Expect the wrapper object to be defined
    expect(wrapper.find(TableBody)).toBeDefined();
    expect(
      wrapper
        .find(TableBody)
        .find(TableRow)
        .find(TableCell)
    ).toHaveLength(6);
  });

  it("renders correctly when there are no tasks", () => {
    const tree = renderer
      .create(<TasksTable onDeleteClick={mockDispatch} tasks={{}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when there are multiple tasks", () => {
    const tree = renderer
      .create(
        <Router>
          <TasksTable onDeleteClick={mockDispatch} tasks={tasks} />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
