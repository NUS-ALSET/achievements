/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";

import CohortsTable from "../CohortsTable";
import { TableBody, TableRow } from "@material-ui/core";

describe("<CohortsTable>", () => {
  let shallow;
  let mockDispatch;
  let cohorts;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow({
      dive: true
    });
    cohorts = {
      cohort1: {
        id: "test",
        name: "Test"
      },
      cohort2: {
        id: "test2",
        name: "Test2"
      }
    };
  });

  it("renders without throwing with multiple cohorts", () => {
    const tree = renderer
      .create(
        <Router>
          <CohortsTable
            cohorts={cohorts}
            currentUserId="-DjgKGJ12hjh_"
            onEditCohortClick={mockDispatch}
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should render cohorts list", () => {
    const wrapper = shallow(
      <CohortsTable
        cohorts={cohorts}
        currentUserId="-DjgKGJ12hjh_"
        onEditCohortClick={mockDispatch}
      />
    );

    // Expect the wrapper object to be defined
    expect(wrapper.find(TableBody)).toBeDefined();
    expect(wrapper.find(TableBody).find(TableRow)).toHaveLength(
      Object.keys(cohorts).length
    );
  });

  it("should render empty list", () => {
    const wrapper = shallow(
      <CohortsTable
        cohorts={{}}
        currentUserId="-hkjkjvhfi_dnvj"
        onEditCohortClick={mockDispatch}
      />
    );

    expect(
      wrapper
        .find(TableBody)
        .find(TableRow)
        .find(TableCell).length
    ).toEqual(1);
  });

  it("should render buttons for owner", () => {
    const cohorts = {
      cohort1: {
        id: "test",
        name: "Test",
        owner: "fdefjgwdwdfKGJ12hjh_"
      }
    };
    const wrapper = shallow(
      <CohortsTable
        cohorts={cohorts}
        currentUserId="-hkjkjvhfi_dnvj"
        onEditCohortClick={mockDispatch}
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

  it("renders without crashing when there are no cohorts", () => {
    const tree = renderer
      .create(
        <CohortsTable
          cohorts={{}}
          currentUserId="-hkjkjvhfi_dnvj"
          onEditCohortClick={mockDispatch}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when there are multiple cohorts", () => {
    const tree = renderer
      .create(
        <Router>
          <CohortsTable
            cohorts={cohorts}
            currentUserId="-hkjkjvhfi_dnvj"
            onEditCohortClick={mockDispatch}
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
