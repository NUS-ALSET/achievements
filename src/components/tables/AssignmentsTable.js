import {
  assignmentSolutionRequest,
  assignmentSubmitRequest,
  assignmentsSortChange,
  courseRemoveStudentDialogShow,
  assignmentPathProblemSolutionRequest
} from "../../containers/Assignments/actions";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";

import DeleteIcon from "material-ui-icons/Delete";

import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "material-ui/Table";
import { AccountService } from "../../services/account";

class AssignmentsTable extends React.PureComponent {
  static propTypes = {
    course: PropTypes.object,
    isInstructor: PropTypes.bool.isRequired,
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
            href={`https://codecombat.com/user/${AccountService.processProfile(
              "CodeCombat",
              result.replace(/ \(\d+\)$/, "")
            )}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {result}
          </a>
        ) : (
          undefined
        );
      case "Text":
        return /http[s]?:\/\//.test(result) ? (
          <a href={result} rel="noopener noreferrer" target="_blank">
            {result}
          </a>
        ) : (
          result
        );
      default:
        return result;
    }
  }

  onStudentRemoveClick = studentInfo =>
    this.props.dispatch(
      courseRemoveStudentDialogShow(
        this.props.course.id,
        studentInfo.id,
        studentInfo.name
      )
    );

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
      case "PathProblem":
        dispatch(
          assignmentPathProblemSolutionRequest(
            assignment,
            course.owner,
            assignment.problem,
            solution
          )
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
      isInstructor,
      currentUser,
      sortState
    } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortState.field === "studentName"}
                direction={sortState.direction}
                onClick={() => this.onSortClick()}
                style={{
                  minWidth: 250
                }}
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
                        href={assignment.details}
                        rel="noopener noreferrer"
                        target="_blank"
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
                <TableCell>
                  {isInstructor &&
                    course.owner === currentUser.id && (
                      <IconButton
                        onClick={() => this.onStudentRemoveClick(studentInfo)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  {studentInfo.name}
                </TableCell>
                {course.assignments
                  .filter(assignment => assignment.visible)
                  .map(assignment => (
                    <TableCell key={assignment.id}>
                      <Fragment>
                        {this.getSolution(assignment, studentInfo.solutions)}

                        {studentInfo.id === currentUser.id && (
                          <Button
                            onClick={() =>
                              this.onSubmitClick(
                                assignment,
                                studentInfo.solutions[assignment.id]
                              )
                            }
                            style={{
                              marginLeft: 4
                            }}
                            variant="raised"
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
