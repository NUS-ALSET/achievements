/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";

import CoursesTable from "../CoursesTable";
import { TableBody, TableRow } from "@material-ui/core";

describe("<CoursesTable>", () => {
  let shallow;
  let mockDispatch;
  let courses;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow({
      dive: true
    });
    courses = [
      {
        id: "test",
        name: "Test"
      },
      {
        id: "test2",
        name: "Test2"
      }
    ];
  });

  it("renders correctly when there are multiple courses", () => {
    const tree = renderer
      .create(
        <Router>
          <CoursesTable
            courses={courses}
            dispatch={mockDispatch}
            fetchedCourses={true}
            ownerId="-DjgKGJ12hjh_"
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should render empty list", () => {
    const wrapper = shallow(
      <CoursesTable
        courses={[]}
        dispatch={mockDispatch}
        fetchedCourses={true}
        ownerId="-DjgKGJ12hjh_"
      />
    );

    expect(
      wrapper
        .find(TableBody)
        .find(TableRow)
        .find(TableCell).length
    ).toEqual(1);
  });

  it("should render activities list", () => {
    const wrapper = shallow(
      <CoursesTable
        courses={courses}
        dispatch={mockDispatch}
        fetchedCourses={true}
        ownerId="-DjgKGJ12hjh_"
      />
    );

    // Expect the wrapper object to be defined
    expect(wrapper.find(TableBody)).toBeDefined();
    expect(wrapper.find(TableBody).find(TableRow)).toHaveLength(courses.length);
  });

  it("should render buttons for owner", () => {
    const courses = [
      {
        id: "test",
        name: "Test",
        owner: "-DjgKGJ12hjh_"
      }
    ];
    const wrapper = shallow(
      <CoursesTable
        courses={courses}
        dispatch={mockDispatch}
        fetchedCourses={true}
        ownerId="-DjgKGJ12hjh_"
      />
    );

    // Expect the wrapper object to be defined
    expect(wrapper.find(TableBody)).toBeDefined();
    expect(
      wrapper
        .find(TableBody)
        .find(TableRow)
        .find(TableCell)
    ).toHaveLength(3);
  });

  it("renders correctly when there are no courses", () => {
    const tree = renderer
      .create(
        <CoursesTable
          courses={[]}
          dispatch={mockDispatch}
          fetchedCourses={true}
          ownerId="-DjgKGJ12hjh_"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when there are multiple courses", () => {
    const tree = renderer
      .create(
        <Router>
          <CoursesTable
            courses={courses}
            dispatch={mockDispatch}
            fetchedCourses={true}
            ownerId="-DjgKGJ12hjh_"
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
