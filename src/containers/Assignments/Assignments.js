import { LinearProgress } from "material-ui/Progress";
import { Link, withRouter } from "react-router-dom";
import {
  assignmentCloseDialog,
  assignmentRefreshProfilesRequest,
  assignmentSolutionRequest,
  assignmentSwitchTab,
  assignmentsAssistantsShowRequest,
  coursePasswordEnterSuccess
} from "./actions";
import { compose } from "redux";
import { connect } from "react-redux";
import { coursesService } from "../../services/courses";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import {
  getAssignmentsUIProps,
  getCourseProps,
  getCurrentUserProps
} from "./selectors";
import { sagaInjector } from "../../services/saga";

import AddProfileDialog from "../../components/dialogs/AddProfileDialog";
import AddTextSolutionDialog from "../../components/dialogs/AddTextSolutionDialog";
import AssignmentsTable from "../../components/tables/AssignmentsTable";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";

import ChevronRightIcon from "material-ui-icons/ChevronRight";
import RefreshIcon from "material-ui-icons/Refresh";

import Grid from "material-ui/Grid";
import InstructorTabs from "../../components/InstructorTabs";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import TextField from "material-ui/TextField";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import sagas from "./sagas";
import withStyles from "material-ui/styles/withStyles";
import ControlAssistantsDialog from "../../components/dialogs/ControlAssistantsDialog";
import { APP_SETTING } from "../../achievementsApp/config";
import RemoveStudentDialog from "../../components/dialogs/RemoveStudentDialog";
import AddPathProblemSolutionDialog from "../../components/dialogs/AddPathProblemSolutionDialog";
import MoveStudentDialog from "../../components/dialogs/MoveStudentDialog";

const styles = theme => ({
  breadcrumbLink: {
    textDecoration: "none"
  },
  breadcrumbText: {
    margin: theme.spacing.unit,
    textTransform: "uppercase",
    fontSize: "0.875rem"
  },
  actions: {
    position: "absolute",
    right: theme.spacing.unit
  },
  action: {
    marginLeft: theme.spacing.unit
  }
});

class Assignments extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    classes: PropTypes.any,
    ui: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    firebase: PropTypes.object,
    auth: PropTypes.object,
    courseMembers: PropTypes.object
  };
  state = {
    password: ""
  };

  handleTabChange = (event, tabIndex) => {
    this.props.dispatch(assignmentSwitchTab(tabIndex));
  };

  handlePasswordChange = event =>
    this.setState({
      password: event.currentTarget.value
    });

  submitPassword = () => {
    const { course, firebase, currentUser, dispatch } = this.props;

    coursesService
      .tryCoursePassword(course.id, this.state.password)
      // This ref requires existing courseMember item at `firebaseConnect` rises an error and stops to work
      // So, we have firstly remove listeners
      .then(() =>
        Promise.all(
          [
            `solutions/${course.id}`,
            `solutions/${course.id}/${currentUser.id}`,
            `visibleSolutions/${course.id}`,
            `assignments/${course.id}`,
            "userAchievements"
          ].map(path => Promise.resolve(firebase.unWatchEvent("value", path)))
        )
      )
      .then(() =>
        // And then we have to add listeners back
        Promise.all(
          [
            `solutions/${course.id}`,
            `solutions/${course.id}/${currentUser.id}`,
            `visibleSolutions/${course.id}`,
            `assignments/${course.id}`,
            "userAchievements"
          ].map(path => Promise.resolve(firebase.watchEvent("value", path)))
        )
      )
      .then(() => dispatch(coursePasswordEnterSuccess(course.id)));
  };

  onProfileCommit = value => {
    const { course, ui, dispatch } = this.props;

    dispatch(
      assignmentSolutionRequest(course.id, ui.currentAssignment.id, value)
    );
    this.closeDialog();
  };

  closeDialog = () => {
    this.props.dispatch(assignmentCloseDialog());
  };

  refreshProfileSolutions = () =>
    this.props.dispatch(assignmentRefreshProfilesRequest(this.props.course.id));

  assignmentsAssistantsShowRequest = () =>
    this.props.dispatch(assignmentsAssistantsShowRequest(this.props.course.id));

  getPasswordView() {
    return (
      <Fragment>
        <TextField
          autoFocus
          fullWidth
          label="Enter password"
          onChange={this.handlePasswordChange}
          type="password"
        />
        <Grid container>
          <Grid item xs={12}>
            <Grid
              alignContent="center"
              alignItems="center"
              container
              direction="column"
            >
              <Grid item />
              <Grid>
                <Button
                  color="primary"
                  onClick={this.submitPassword}
                  variant="raised"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }

  render() {
    const {
      ui,
      classes,
      courseMembers,
      auth,
      dispatch,
      course,
      currentUser
    } = this.props;

    if (!auth.isLoaded) {
      return <LinearProgress />;
    } else if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    } else if (!isLoaded(courseMembers)) {
      return <LinearProgress />;
    }

    // Default view with password enter
    let AssignmentView = this.getPasswordView();

    // If owner match user id then we suppose use as instructor and give him special view
    if (currentUser.isAssistant) {
      AssignmentView = (
        <InstructorTabs
          closeDialog={this.closeDialog}
          course={course}
          currentUser={currentUser}
          dispatch={dispatch}
          handleTabChange={this.handleTabChange}
          paths={[]}
          problems={[]}
          ui={ui}
        />
      );
    } else if (course.members && course.members[currentUser.id]) {
      // Otherwise - just provide list of assignments for student-member
      AssignmentView = (
        <AssignmentsTable
          course={course}
          currentUser={currentUser}
          dispatch={dispatch}
          isInstructor={false}
          sortState={ui.sortState}
        />
      );
    }
    return (
      <Fragment>
        <Toolbar>
          <Link className={classes.breadcrumbLink} to="/courses">
            <Typography className={classes.breadcrumbText}>Courses</Typography>
          </Link>
          <ChevronRightIcon />
          <Typography className={classes.breadcrumbText}>
            {course.name}
          </Typography>
          {course.owner === currentUser.id &&
            (APP_SETTING.isSuggesting ? (
              <div className={classes.actions}>
                <IconButton onClick={this.refreshProfileSolutions}>
                  <RefreshIcon />
                </IconButton>
              </div>
            ) : (
              <div className={classes.actions}>
                <Button
                  className={classes.action}
                  onClick={this.refreshProfileSolutions}
                  variant="raised"
                >
                  Refresh achievements
                </Button>
              </div>
            ))}
        </Toolbar>
        {APP_SETTING.isSuggesting && (
          <Typography gutterBottom>{course.description}</Typography>
        )}
        {AssignmentView}
        <RemoveStudentDialog
          courseId={course.id}
          courseMemberId={ui && ui.dialog && ui.dialog.studentId}
          courseMemberName={ui && ui.dialog && ui.dialog.studentName}
          dispatch={dispatch}
          open={ui.dialog && ui.dialog.type === "RemoveStudent"}
        />
        <MoveStudentDialog
          courseId={course.id}
          courses={(ui.dialog && ui.dialog.courses) || []}
          dispatch={dispatch}
          open={ui.dialog && ui.dialog.type === "MoveStudent"}
          studentId={ui && ui.dialog && ui.dialog.studentId}
          studentName={ui && ui.dialog && ui.dialog.studentName}
        />
        <AddProfileDialog
          dispatch={dispatch}
          externalProfile={{
            url: "https://codecombat.com",
            name: "Code Combat",
            id: "CodeCombat"
          }}
          onCommit={this.onProfileCommit}
          open={ui.dialog && ui.dialog.type === "Profile"}
          uid={currentUser.id}
        />
        {currentUser.isOwner && (
          <ControlAssistantsDialog
            assistants={(ui.dialog && ui.dialog.assistants) || []}
            course={course}
            dispatch={dispatch}
            newAssistant={ui.dialog && ui.dialog.newAssistant}
            open={ui.dialog && ui.dialog.type === "CourseAssistants"}
          />
        )}
        <AddTextSolutionDialog
          assignment={ui.currentAssignment}
          courseId={course.id}
          dispatch={dispatch}
          open={ui.dialog && ui.dialog.type === "Text"}
          solution={ui.dialog && ui.dialog.value}
        />
        <AddPathProblemSolutionDialog
          assignment={ui.currentAssignment}
          dispatch={dispatch}
          onCommit={this.onProfileCommit}
          open={ui.dialog && ui.dialog.type === "PathProblem"}
          pathProblem={ui.dialog.pathProblem}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

/**
 *
 * @param {AchievementsAppState} state
 * @param ownProps
 * @returns {*} props
 */
const mapStateToProps = (state, ownProps) => ({
  ui: getAssignmentsUIProps(state),
  currentUser: getCurrentUserProps(state, ownProps),
  course: getCourseProps(state, ownProps),
  auth: state.firebase.auth,
  courseMembers: state.firebase.data.courseMembers,
  assistants: state.assignments.assistants
});

export default compose(
  withRouter,
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const courseId = ownProps.match.params.courseId;
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    return [
      "/users",
      "/userAchievements",
      `/courses/${courseId}`,
      `/courseMembers/${courseId}`,
      `/courseAssistants/${courseId}`,
      `/solutions/${courseId}`,
      `/solutions/${courseId}/${uid}`,
      `/visibleSolutions/${courseId}`,
      `/assignments/${courseId}`
    ];
  }),
  connect(mapStateToProps)
)(Assignments);
