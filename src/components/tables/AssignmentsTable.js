import isEmpty from "lodash/isEmpty";
import { distanceInWords } from "date-fns";

import {
  assignmentSolutionRequest,
  assignmentSubmitRequest,
  assignmentsSortChange,
  courseRemoveStudentDialogShow,
  assignmentPathProblemSolutionRequest,
  courseMoveStudentDialogShow,
  assignmentPathProgressSolutionRequest
} from "../../containers/Assignments/actions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import DeleteIcon from "@material-ui/icons/Delete";
import UserSwitch from "mdi-react/AccountSwitchIcon";

import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import { AccountService } from "../../services/account";
import { YOUTUBE_QUESTIONS } from "../../services/paths";
import { ASSIGNMENTS_TYPES } from "../../services/courses";

class AssignmentsTable extends React.PureComponent {
  static propTypes = {
    course: PropTypes.object,
    isInstructor: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    sortState: PropTypes.object,
    currentUser: PropTypes.object,
    ui: PropTypes.object
  };

  getTooltip(assignment, solution) {
    if (!solution.originalSolution) {
      return "";
    }
    let result = `Created: ${new Date(
      solution.originalSolution.createdAt
    ).toLocaleString()}`;
    switch (assignment.questionType) {
      case "PathProblem":
        if (
          solution.originalSolution &&
          solution.originalSolution.value &&
          solution.originalSolution.value.answers &&
          !isEmpty(solution.originalSolution.value.answers)
        ) {
          result +=
            "\nAnswers:\n" +
            Object.keys(solution.originalSolution.value.answers)
              .map(id => ({
                value: solution.originalSolution.value.answers[id],
                id
              }))
              .map(
                answer =>
                  `- ${YOUTUBE_QUESTIONS[answer.id] ||
                    assignment.customText}:\n   * ${answer.value
                    .split("\n")
                    .join("\n   * ")}`
              )
              .join("\n");
        }
        return result;
      default:
        return result;
    }
  }

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
      case "PathProblem":
        return solution ? (
          <Tooltip title={<pre>{this.getTooltip(assignment, solution)}</pre>}>
            <div>
              {/http[s]?:\/\//.test(
                solution.originalSolution && solution.originalSolution.value
              ) ? (
                <a
                  href={solution.originalSolution.value}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Completed
                </a>
              ) : (
                result
              )}
            </div>
          </Tooltip>
        ) : (
          result
        );

      case "Text":
        return /http[s]?:\/\//.test(result) ? (
          <a href={result} rel="noopener noreferrer" target="_blank">
            Completed
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

  onStudentMoveClick = studentInfo =>
    this.props.dispatch(
      courseMoveStudentDialogShow(
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
      case ASSIGNMENTS_TYPES.PathProgress.id:
        dispatch(
          assignmentPathProgressSolutionRequest(
            assignment,
            course.owner,
            assignment.path
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
                    {(assignment.details ? " " : "") + assignment.progress ||
                      ""}
                  </div>
                  <div>
                    {assignment.deadline &&
                      `Deadline in ${distanceInWords(
                        assignment.deadline,
                        new Date()
                      )}`}
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
                      <Fragment>
                        <IconButton
                          onClick={() => this.onStudentMoveClick(studentInfo)}
                        >
                          <UserSwitch style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => this.onStudentRemoveClick(studentInfo)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Fragment>
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
