import _ from "lodash";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import withStyles from "material-ui/styles/withStyles";
import { LinearProgress } from "material-ui/Progress";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import Tabs, { Tab } from "material-ui/Tabs";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";

import { Link, withRouter } from "react-router-dom";
import TextField from "material-ui/TextField";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import Typography from "material-ui/Typography";
import { coursesService } from "../../services/courses";

import AssignmentsTable from "../../components/AssignmentsTable";
import AssignmentsEditorTable from "../../components/AssignmentsEditorTable";
import { assignmentAddRequest } from "./actions";
import AddAssignmentDialog from "../../components/AddAssignmentDialog";

const INSTRUCTOR_TAB_ASSIGNMENTS = 0;
const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

const styles = theme => ({
  breadcrumbLink: {
    textDecoration: "none"
  },
  breadcrumbText: {
    margin: theme.spacing.unit,
    textTransform: "uppercase",
    fontSize: "0.875rem"
  }
});

class Assignments extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    classes: PropTypes.any,
    course: PropTypes.any,
    match: PropTypes.any,
    courseId: PropTypes.string,
    courseLoaded: PropTypes.any,
    firebase: PropTypes.any,
    userId: PropTypes.string,
    userName: PropTypes.string,
    users: PropTypes.object,
    courseMembers: PropTypes.object,
    history: PropTypes.any,
    currentTab: PropTypes.number,
    userAchievements: PropTypes.object,
    assignments: PropTypes.object,
    solutions: PropTypes.object
  };

  // Force show assignments (when become participant)
  state = {
    showAssignments: false,
    currentTab: 0,
    dialogOpen: false
  };

  onAddAssignmentClick = () => {
    this.props.dispatch(assignmentAddRequest());
    this.setState({
      dialogOpen: true
    });
  };

  handleTabChange = (event, tabIndex) => {
    this.setState({
      currentTab: tabIndex
    });
  };

  handlePasswordChange = event =>
    this.setState({
      value: event.currentTarget.value
    });

  createAssignment = assignmentDetails => {
    const { courseId } = this.props;

    coursesService.addAssignment(courseId, assignmentDetails);
    this.setState({ dialogOpen: false });
  };

  onUpdateAssignment = (assignmentId, field, value) => {
    const { courseId } = this.props;

    coursesService.updateAssignment(courseId, assignmentId, field, value);
  };

  submitSolution = (sourceId, assignment) => {
    coursesService.submitSolution(sourceId, assignment, this.props.userId);
  };

  submitPassword = () => {
    const { courseId } = this.props;

    coursesService.tryCoursePassword(courseId, this.state.value);
  };

  getAssignments = () => {
    const {
      assignments,
      courseMembers,
      users,
      courseId,
      userName,
      userId,
      solutions
    } = this.props;
    const members = Object.keys(courseMembers).map(userId =>
      Object.assign({ id: userId }, users[userId])
    );
    const result = [];
    let currentUserData = [];

    for (let i = 0; i < members.length; i++) {
      _.each(assignments, (assignment, assignmentId) => {
        let solution = solutions[members[i].id];

        solution = solution && solution[assignmentId];

        const unknownSolution =
          assignment.solutionVisible || members[i].id === userId
            ? "Incomplete"
            : "Who knows";

        switch (assignment.questionType) {
          case "Profile":
            if (solution) {
              solution = (
                <a href={`https://codecombat.com/user/${solution}`}>
                  {solution}
                </a>
              );
            }

            break;
          default:
            solution = solution || unknownSolution;
        }

        const userData = {
          studentName: members[i].displayName,
          assignment: assignment.name,
          solution: solution || unknownSolution,
          actions:
            members[i].id === userId ? (
              <Button
                onClick={() =>
                  this.submitSolution(courseId, {
                    ...assignment,
                    id: assignmentId
                  })
                }
              >
                {solutions[assignmentId] ? "Update" : "Submit"}
              </Button>
            ) : (
              ""
            )
        };

        if (userData.studentName === userName) {
          currentUserData.push(userData);
        } else {
          result.push(userData);
        }
      });
    }

    return currentUserData.concat(result);
  };

  render() {
    const {
      history,
      course,
      courseLoaded,
      classes,
      assignments,
      courseMembers,
      userId,
      userName,
      userAchievements
    } = this.props;

    if (!courseLoaded) {
      return <LinearProgress />;
    }
    if (!course) {
      history.push("/courses");
    }

    // Default view with password enter
    let AssignmentView = (
      <Fragment>
        <TextField
          onChange={this.handlePasswordChange}
          type="password"
          autoFocus
          fullWidth={true}
          label="Enter password"
        />
        <Grid container>
          <Grid item xs={12}>
            <Grid
              container
              alignContent="center"
              alignItems="center"
              direction="column"
            >
              <Grid item />
              <Grid>
                <Button raised color="primary" onClick={this.submitPassword}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );

    // If owner match user id then we suppose use as instructor and give him special view
    if (course.owner === userId) {
      let instructorTab;

      switch (this.state.currentTab) {
        case INSTRUCTOR_TAB_ASSIGNMENTS:
          instructorTab = (
            <AssignmentsTable assignments={this.getAssignments()} />
          );
          break;
        case INSTRUCTOR_TAB_EDIT:
          instructorTab = (
            <Fragment>
              <AssignmentsEditorTable
                onAddAssignmentClick={this.onAddAssignmentClick}
                onUpdateAssignment={this.onUpdateAssignment}
                assignments={assignments || {}}
              />
              <AddAssignmentDialog
                userAchievements={userAchievements}
                handleCommit={this.createAssignment}
                handleCancel={() => this.setState({ dialogOpen: false })}
                open={this.state.dialogOpen}
              />
            </Fragment>
          );
          break;
        case INSTRUCTOR_TAB_VIEW:
          instructorTab = <div>Not implemented</div>;
          break;
        default:
          instructorTab = <div>Something goes wrong</div>;
      }

      AssignmentView = (
        <Fragment>
          <Tabs value={this.state.currentTab} onChange={this.handleTabChange}>
            <Tab label={"Assignments"} />
            <Tab label="Edit" />
            <Tab label="Instructor view" />
          </Tabs>
          {instructorTab}
        </Fragment>
      );
    } else if (courseMembers && courseMembers[userId]) {
      // Otherwise - just provide list of assignments for student-member
      AssignmentView = (
        <AssignmentsTable
          studentName={userName}
          assignments={this.getAssignments()}
        />
      );
    }

    return (
      <Fragment>
        <Toolbar>
          <Link to="/Courses" className={classes.breadcrumbLink}>
            <Typography className={classes.breadcrumbText}>Courses</Typography>
          </Link>
          <ChevronRightIcon />
          <Typography className={classes.breadcrumbText}>
            {course.name}
          </Typography>
        </Toolbar>
        {AssignmentView}
      </Fragment>
    );
  }
}

// Returns value from
const getFrom = (source, field) => {
  return (source || {})[field] || {};
};

const mapStateToProps = (state, ownProps) => {
  const courseId = ownProps.match.params.courseId;
  const userId = state.firebase.auth.uid;

  return {
    currentTab: state.assignments.currentTab,
    userId: state.firebase.auth.uid,
    userName: state.firebase.auth.displayName,
    courseLoaded: isLoaded(state.firebase.data.courseMembers),
    courseId,
    courseMembers: getFrom(state.firebase.data.courseMembers, courseId),
    assignments: getFrom(state.firebase.data.assignments, courseId),
    solutions: getFrom(state.firebase.data.solutions, courseId),
    solutionStatuses: getFrom(state.firebase.data.solutions, courseId),
    userAchievements: getFrom(state.firebase.data.userAchievements, userId),
    users: state.firebase.data.users || {},
    course:
      isLoaded(state.firebase.data.courses) &&
      getFrom(state.firebase.data.courses, courseId)
  };
};

export default compose(
  withRouter,
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const courseId = ownProps.match.params.courseId;
    const userId = store.getState().firebase.auth.uid;
    return [
      `/courseMembers/${courseId}`,
      `/solutions/${courseId}/${userId}`,
      "/users",
      `/assignments/${courseId}`,
      `/userAchievements/${userId}`
    ];
  }),
  connect(mapStateToProps)
)(Assignments);
