import {
  assignmentSolutionRequest,
  assignmentSubmitRequest,
  assignmentsSortChange
} from "../../containers/Assignments/actions";
import Button from "material-ui/Button";

import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "material-ui/Table";

class AssignmentsTable extends React.PureComponent {
  static propTypes = {
    course: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    sortState: PropTypes.object,
    currentUser: PropTypes.object
  };

  getSolution(assignment, solutions) {
    let solution = solutions[assignment.id];
    const result = (solution && solution.value) || "";

    switch (assignment.questionType) {
      case "Profile":
        return solution ? (
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://codecombat.com/user/${result.replace(
              / \(\d+\)$/,
              ""
            )}`}
          >
            {result}
          </a>
        ) : (
          undefined
        );
      case "Text":
        return /http[s]?:\/\//.test(result) ? (
          <a rel="noopener noreferrer" target="_blank" href={result}>
            {result}
          </a>
        ) : (
          result
        );
      default:
        return result;
    }
  }

  onSortClick = assignment =>
    this.props.dispatch(
      assignmentsSortChange((assignment && assignment.id) || "studentName")
    );

  onSubmitClick = (assignment, solution) => {
    const { course, dispatch } = this.props;

    switch (assignment.questionType) {
      case "CodeCombat":
      case "CodeCombat_Number":
        dispatch(
          assignmentSolutionRequest(course.id, assignment.id, "Complete")
        );
        break;
      default:
        dispatch(assignmentSubmitRequest(assignment, solution));
    }
  };

  render() {
    const {
      /** @type AssignmentCourse */
      course,
      currentUser,
      sortState
    } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                style={{
                  minWidth: 250
                }}
                active={sortState.field === "studentName"}
                direction={sortState.direction}
                onClick={() => this.onSortClick()}
              >
                Student name
              </TableSortLabel>
            </TableCell>
            {course.assignments
              .filter(assignment => assignment.visible)
              .map(assignment => (
                <TableCell
                  key={assignment.id}
                  style={{
                    minWidth: 250,
                    whiteSpace: "normal",
                    wordWrap: "break-word"
                  }}
                >
                  <TableSortLabel
                    active={sortState.field === assignment.id}
                    direction={sortState.direction}
                    onClick={() => this.onSortClick(assignment)}
                  >
                    {assignment.name}
                  </TableSortLabel>
                  <div>
                    {assignment.details && (
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={assignment.details}
                      >
                        details
                      </a>
                    )}
                  </div>
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(course.members).map(id => {
            const studentInfo = course.members[id];
            return (
              <TableRow key={studentInfo.id}>
                <TableCell>{studentInfo.name}</TableCell>
                {course.assignments
                  .filter(assignment => assignment.visible)
                  .map(assignment => (
                    <TableCell key={assignment.id}>
                      <Fragment>
                        {this.getSolution(assignment, studentInfo.solutions)}

                        {studentInfo.id === currentUser.id && (
                          <Button
                            style={{
                              marginLeft: 4
                            }}
                            raised
                            onClick={() =>
                              this.onSubmitClick(
                                assignment,
                                studentInfo.solutions[assignment.id]
                              )
                            }
                          >
                            {studentInfo.solutions[assignment.id]
                              ? "Update"
                              : "Submit"}
                          </Button>
                        )}
                      </Fragment>
                    </TableCell>
                  ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default AssignmentsTable;
