import isEmpty from "lodash/isEmpty";
import { distanceInWords } from "date-fns";

import {
  assignmentSolutionRequest,
  assignmentSubmitRequest,
  assignmentsSortChange,
  courseRemoveStudentDialogShow,
  assignmentPathProblemSolutionRequest,
  courseMoveStudentDialogShow,
  assignmentPathProgressSolutionRequest,
  assignmentTeamChoiceSolutionRequest
} from "../../containers/Assignments/actions";

import PropTypes from "prop-types";
import React, { Fragment } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Link from "react-router-dom/Link";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";

import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import Timeline from "@material-ui/icons/Timeline";
import UserSwitch from "mdi-react/AccountSwitchIcon";

import { AccountService } from "../../services/account";
import { YOUTUBE_QUESTIONS } from "../../services/paths";
import { ASSIGNMENTS_TYPES } from "../../services/courses";
import AnalysisDialog from "../dialogs/AnalysisDialog";
import { courseInfo } from "../../types";

const MAX_TEXT_LENGTH = 39;
const MAX_NAME_LENGTH = 15;

const styles = theme => ({
  narrowCell: {
    padding: theme.spacing.unit
  },
  noWrapTooltip: {
    maxWidth: "350px",
    // so tooltip does not have overflow hidden
    overflowWrap: "break-word",
    // and keep code formating
    whiteSpace: "pre-wrap"
  },
  nowrap: {
    whiteSpace: "nowrap"
  },
  link: {
    color: "unset",
    textDecoration: "none"
  }
});

// Tooltip sometimes flickers on GUI, related to this issue:
// [Tooltip] Flickers when overlaped with element it is attached to #10735
// https://github.com/mui-org/material-ui/issues/10735
// suggested solution from the thread is:
// <Tooltip PopperProps={{ style: { pointerEvents: 'none' } }}>

class AssignmentsTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    course: courseInfo,

    isInstructor: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    sortState: PropTypes.object,
    currentUser: PropTypes.object
  };

  state = {
    menuAnchor: null,
    currentStudent: null,
    analysisDialog: {
      open: false,
      name: "",
      data: {}
    }
  };
  openAnalysisDialog = (activityId, name) =>
    this.setState({ analysisDialog: { open: true, name, activityId } });

  handleCloseAnalysisDialog = () =>
    this.setState({ analysisDialog: { open: false, data: {} } });

  getTooltip(assignment, solution) {
    if (
      !(
        solution.originalSolution &&
        solution.originalSolution.value &&
        solution.originalSolution.value
      )
    ) {
      return "";
    }
    let result = `Created: ${new Date(
      solution.originalSolution.createdAt
    ).toLocaleString()}`;
    switch (assignment.questionType) {
      // Backward compatibility
      case "PathProblem":
      case "PathActivity":
        if (
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
        if (solution.originalSolution.value.cells) {
          result +=
            "\nSolution:\n" +
            solution.originalSolution.value.cells
              .map(cell => cell.source.join(""))
              .join("\n");
        }
        return result;
      default:
        return result;
    }
  }

  /**
   *
   * @param {String} result
   */
  getReducedLength(result) {
    const { classes } = this.props;

    result = result || "";

    if (result.length > MAX_TEXT_LENGTH) {
      return (
        <Tooltip
          classes={{ tooltip: classes.noWrapTooltip }}
          PopperProps={{ style: { pointerEvents: "none" } }}
          title={result}
        >
          <span>{result.slice(0, MAX_TEXT_LENGTH) + "..."}</span>
        </Tooltip>
      );
    }
    return result;
  }

  getSolution(assignment, solutions, owner) {
    const { classes } = this.props;
    let solution = solutions[assignment.id];
    const result = (solution && solution.value) || "";
    if (!solution) {
      return owner && "";
    }
    // solution - True
    switch (assignment.questionType) {
      case ASSIGNMENTS_TYPES.Profile.id:
        return (
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
        );
      // Backward compatibility
      case "PathProblem":
      case ASSIGNMENTS_TYPES.PathActivity.id:
        return (
          <Tooltip
            classes={{ tooltip: classes.noWrapTooltip }}
            PopperProps={{ style: { pointerEvents: "none" } }}
            title={this.getTooltip(assignment, solution)}
          >
            <span>
              {/^http[s]?:\/\//.test(
                solution.originalSolution && solution.originalSolution.value
              ) ? (
                <a
                  href={solution.originalSolution.value}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {result || "COMPLETED"}
                </a>
              ) : (
                result
              )}
            </span>
          </Tooltip>
        );

      case ASSIGNMENTS_TYPES.Text.id:
      case ASSIGNMENTS_TYPES.TeamText.id:
        return (
          <span>
            {/^http[s]?:\/\//.test(result) ? (
              <a href={result} rel="noopener noreferrer" target="_blank">
                COMPLETED
              </a>
            ) : (
              this.getReducedLength(result)
            )}
          </span>
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

  onCloseStudentMenu = () =>
    this.setState({ menuAnchor: false, currentStudent: false });
  onShowStudentMenu = (studentInfo, e) =>
    this.setState({ menuAnchor: e.target, currentStudent: studentInfo });

  onSortClick = assignment =>
    this.props.dispatch(
      assignmentsSortChange((assignment && assignment.id) || assignment)
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
      // Backward compatibility
      case "PathProblem":
      case "PathActivity":
        dispatch(
          assignmentPathProblemSolutionRequest(
            assignment,
            course.owner,
            assignment.pathActivity || assignment.problem,
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
      case ASSIGNMENTS_TYPES.TeamFormation.id:
        dispatch(
          assignmentSubmitRequest(
            assignment,
            solution &&
              solution.value && {
                ...solution,
                value: solution.value.replace(/ \(\d+\)$/, "")
              }
          )
        );
        break;
      case ASSIGNMENTS_TYPES.TeamChoice.id:
        dispatch(
          assignmentTeamChoiceSolutionRequest(course.id, assignment, solution)
        );
        break;
      default:
        dispatch(assignmentSubmitRequest(assignment, solution));
    }
  };

  openSolution = (assignment, solution) => {
    if (["PathActivity", "PathProblem"].includes(assignment.questionType)) {
      this.props.dispatch(
        assignmentPathProblemSolutionRequest(
          assignment,
          this.props.course.owner,
          assignment.problem || assignment.pathActivity,
          solution,
          true
        )
      );
    }
  };

  render() {
    

    const {
      classes,
      /** @type AssignmentCourse */
      course,
      isInstructor,
      currentUser,
      sortState
    } = this.props;
    const { currentStudent } = this.state;
    return (
      <Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.nowrap}>
                <TableSortLabel
                  active={sortState.field === "studentName"}
                  direction={sortState.direction}
                  onClick={() => this.onSortClick("studentName")}
                >
                  Student name
                </TableSortLabel>
              </TableCell>
              {course.assignments.map(assignment => (
                <TableCell
                  classes={{
                    root: classes.narrowCell
                  }}
                  className={classes.nowrap}
                  key={assignment.id}
                  style={{
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
                    {(assignment.questionType !== "PathActivity") &&
                      assignment.details && (
                        <a
                          href={assignment.details}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          link
                        </a>
                      )}
                    {" (" + assignment.progress + " students submitted)"}
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
              {course.watchSeveralPaths && (
                <TableCell>
                  <TableSortLabel
                    active={sortState.field === "pathProgress"}
                    direction={sortState.direction}
                    onClick={() => this.onSortClick("pathProgress")}
                  >
                    Combined Paths Progress
                  </TableSortLabel>
                </TableCell>
              )}
              {isInstructor && (
                <TableCell className={classes.nowrap}>
                  <TableSortLabel
                    active={sortState.field === "progress"}
                    direction={sortState.direction}
                    onClick={() => this.onSortClick("progress")}
                  >
                    Assignments Progress <br />
                    (last submitted time)
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(course.members).map(id => {
              const studentInfo = course.members[id];
              return (
                <TableRow key={studentInfo.id}>
                  <TableCell className={classes.nowrap}>
                    {isInstructor && currentUser.isAssistant && (
                      <IconButton
                        onClick={e => this.onShowStudentMenu(studentInfo, e)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                    <Tooltip
                      classes={{ tooltip: classes.noWrapTooltip }}
                      PopperProps={{ style: { pointerEvents: "none" } }}
                      title={studentInfo.name}
                    >
                      <span>
                        {studentInfo.name.slice(0, MAX_NAME_LENGTH) +
                          (studentInfo.name.length > MAX_NAME_LENGTH
                            ? "..."
                            : "")}
                      </span>
                    </Tooltip>
                  </TableCell>
                  {course.assignments.map(assignment => (
                    <TableCell className={classes.nowrap} key={assignment.id}>
                      <Fragment>
                        {this.getSolution(
                          assignment,
                          studentInfo.solutions,
                          studentInfo.id === currentUser.id
                        )}
                        {isInstructor &&
                          studentInfo.solutions[assignment.id] &&
                          // Add old type support
                          ["PathActivity", "PathProblem"].includes(
                            assignment.questionType
                          ) && (
                            <Fragment>
                              <IconButton
                                onClick={() =>
                                  this.openSolution(
                                    assignment,
                                    studentInfo.solutions[assignment.id]
                                  )
                                }
                              >
                                <Tooltip
                                  PopperProps={{
                                    style: {
                                      pointerEvents: "none"
                                    }
                                  }}
                                  title={"View Solution"}
                                >
                                  <RemoveRedEye />
                                </Tooltip>
                              </IconButton>
                              {(
                                (studentInfo.solutions[assignment.id] || {})
                                  .originalSolution || {}
                              ).userSkills && (
                                <IconButton
                                  onClick={() =>
                                    this.openAnalysisDialog(
                                      assignment.id,
                                      assignment.name
                                    )
                                  }
                                >
                                  <Tooltip
                                    PopperProps={{
                                      style: {
                                        pointerEvents: "none"
                                      }
                                    }}
                                    title={"View Analysis"}
                                  >
                                    <Timeline />
                                  </Tooltip>
                                </IconButton>
                              )}
                            </Fragment>
                          )}

                        {studentInfo.id === currentUser.id &&
                          new Date() <= new Date(assignment.deadline) && (
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
                              variant="contained"
                            >
                              {studentInfo.solutions[assignment.id]
                                ? "Update"
                                : "Submit"}
                            </Button>
                          )}
                      </Fragment>
                    </TableCell>
                  ))}
                  {course.watchSeveralPaths && (
                    <TableCell className={classes.nowrap}>
                      {`${studentInfo.pathProgress.totalSolutions} / ${
                        studentInfo.pathProgress.totalActivities
                      }`}
                    </TableCell>
                  )}
                  
                  {isInstructor && (
                    <TableCell className={classes.nowrap}>
                      {`${studentInfo.progress.totalSolutions} / ${
                        course.totalAssignments
                      } (${
                        studentInfo.progress.lastSolutionTime
                          ? new Date(
                              studentInfo.progress.lastSolutionTime
                            ).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Singapore"
                            })
                          : "no submissions yet"
                      })`}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {currentStudent && (
          <Popper
            anchorEl={this.state.menuAnchor}
            open={true}
            placement="left-start"
          >
            <Paper>
              <ClickAwayListener onClickAway={this.onCloseStudentMenu}>
                <MenuList>
                  <MenuItem
                    onClick={() => this.onStudentMoveClick(currentStudent)}
                  >
                    <ListItemIcon>
                      <UserSwitch style={{ fill: "rgba(0, 0, 0, 0.54)" }} />
                    </ListItemIcon>
                    <ListItemText>Move student to another course</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => this.onStudentRemoveClick(currentStudent)}
                  >
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Remove student from course</ListItemText>
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/profile/${currentStudent.id}`}
                  >
                    <ListItemIcon>
                      <TagFacesIcon />
                    </ListItemIcon>
                    <ListItemText>Open profile link</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>
        )}
        <AnalysisDialog
          activityId={this.state.analysisDialog.activityId}
          handleClose={this.handleCloseAnalysisDialog}
          name={this.state.analysisDialog.name}
          open={this.state.analysisDialog.open}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(AssignmentsTable);
