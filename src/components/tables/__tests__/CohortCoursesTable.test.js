/* eslint-disable no-magic-numbers */
import React from "react";
// import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";
import CohortCoursesTable from "../CohortCoursesTable";

describe("<CohortCoursesTable>", () => {
  //   let shallow;
  let mockDispatch;
  let cohort;
  let courses;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    // shallow = createShallow({
    //   dive: true
    // });
    cohort = {
      id: "test",
      name: "Test",
      description: "desc",
      paths: ["_PYBghjgnu_ghju", "_yKrfJGhnu_ghju"]
    };
    courses = [
      {
        name: "course 1",
        id: "_PofghTkjdEDyhj-"
      },
      {
        name: "course 2",
        id: "_TjJHGlkjdEDyhj-"
      }
    ];
  });

  it("renders without throwing", () => {
    const tree = renderer
      .create(
        <Router>
          <CohortCoursesTable
            cohort={cohort}
            courses={courses}
            isInstructor={true}
            membersPathsRanking={{}}
            onRemoveClick={mockDispatch}
            onSortClick={mockDispatch}
            sortState={{ field: "testfield", direction: "asc" }}
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
