import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import withStyles from "material-ui/styles/withStyles";
import { LinearProgress } from "material-ui/Progress";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";

import { Link, withRouter } from "react-router-dom";
import TextField from "material-ui/TextField";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import Typography from "material-ui/Typography";
import { coursesService } from "../../services/courses";

import AssignmentsTable from "../../components/AssignmentsTable";
import {
  assignmentAddRequest,
  assignmentCloseDialog,
  assignmentDeleteRequest,
  assignmentShowAddDialog,
  assignmentSolutionRequest,
  assignmentsSortChange,
  assignmentSubmitRequest,
  assignmentSwitchTab,
  coursePasswordEnterSuccess,
  updateNewAssignmentField
} from "./actions";
import AddProfileDialog from "../../components/AddProfileDialog";
import {
  getAssignmentsUIProps,
  getCourseProps,
  getCurrentUserProps
} from "./selectors";
import AddTextSolutionDialog from "../../components/AddTextSolutionDialog";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import InstructorTabs from "../../components/InstructorTabs";

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

  onAddAssignmentClick = () => {
    this.props.dispatch(assignmentShowAddDialog());
  };

  handleTabChange = (event, tabIndex) => {
    this.props.dispatch(assignmentSwitchTab(tabIndex));
  };

  handlePasswordChange = event =>
    this.setState({
      password: event.currentTarget.value
    });

  onCreateAssignmentClick = () => {
    /** @type AssignmentProps */
    const { dispatch, course, ui } = this.props;

    dispatch(assignmentAddRequest(course.id, ui.dialog.value));
  };

  onDeleteAssignment = assignment => {
    this.props.dispatch(assignmentDeleteRequest(assignment));
  };

  onUpdateNewAssignmentField = field => e => {
    this.props.dispatch(updateNewAssignmentField(field, e.target.value));
  };

  onUpdateAssignment = (assignmentId, field, value) => {
    const { course } = this.props;

    coursesService.updateAssignment(course.id, assignmentId, field, value);
  };

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

  onSortClick = assignment => {
    this.props.dispatch(
      assignmentsSortChange((assignment && assignment.id) || "studentName")
    );
  };

  onProfileCommit = value => {
    const { course, ui, dispatch } = this.props;

    dispatch(
      assignmentSolutionRequest(course.id, ui.currentAssignment.id, value)
    );
  };

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

  onAcceptClick = (assignment, studentId) => {
    coursesService.acceptSolution(this.props.course.id, assignment, studentId);
  };

  closeDialog = () => {
    this.props.dispatch(assignmentCloseDialog());
  };

  // componentDidMount() {
  //   this.props.firebase.watchEvent(
  //     "value",
  //     `courses/${this.props.match.params.courseId}`
  //   );
  // }
  //
  getPasswordView() {
    return (
      <Fragment>
        <TextField
          onChange={this.handlePasswordChange}
          type="password"
          autoFocus
          fullWidth
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
    if (course.owner === currentUser.id) {
      AssignmentView = (
        <InstructorTabs
          onSortClick={this.onSortClick}
          onSubmitClick={this.onSubmitClick}
          onAddAssignmentClick={this.onAddAssignmentClick}
          onDeleteAssignment={this.onDeleteAssignment}
          onUpdateAssignment={this.onUpdateAssignment}
          onUpdateNewAssignmentField={this.onUpdateNewAssignmentField}
          onCreateAssignmentClick={this.onCreateAssignmentClick}
          closeDialog={this.closeDialog}
          onAcceptClick={this.onAcceptClick}
          handleTabChange={this.handleTabChange}
          ui={ui}
          course={course}
          currentUser={currentUser}
        />
      );
    } else if (course.members && course.members[currentUser.id]) {
      // Otherwise - just provide list of assignments for student-member
      AssignmentView = (
        <AssignmentsTable
          instructorView={false}
          sortState={ui.sortState}
          currentUser={currentUser}
          course={course}
          onSortClick={this.onSortClick}
          onSubmitClick={this.onSubmitClick}
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
        <AddProfileDialog
          uid={currentUser.id}
          open={ui.dialog && ui.dialog.type === "Profile"}
          externalProfile={{
            url: "https://codecombat.com",
            name: "Code Combat",
            id: "CodeCombat"
          }}
          dispatch={dispatch}
          onCommit={this.onProfileCommit}
        />
        <AddTextSolutionDialog
          open={ui.dialog && ui.dialog.type === "Text"}
          courseId={course.id}
          solution={ui.dialog && ui.dialog.value}
          assignment={ui.currentAssignment}
          dispatch={dispatch}
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
  currentUser: getCurrentUserProps(state),
  course: getCourseProps(state, ownProps),
  auth: state.firebase.auth,
  courseMembers: state.firebase.data.courseMembers
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
      `/courses/${courseId}`,
      `/courseMembers/${courseId}`,
      `/solutions/${courseId}`,
      `/solutions/${courseId}/${uid}`,
      `/visibleSolutions/${courseId}`,
      `/assignments/${courseId}`,
      "/userAchievements"
    ];
  }),
  connect(mapStateToProps)
)(Assignments);
