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
import {
  assignmentAddRequest,
  assignmentCloseDialog,
  assignmentDeleteRequest,
  assignmentShowAddDialog,
  assignmentsSortChange,
  assignmentSubmitRequest,
  assignmentSwitchTab,
  updateNewAssignmentField
} from "./actions";
import AddAssignmentDialog from "../../components/AddAssignmentDialog";
import AddProfileDialog from "../../components/AddProfileDialog";
import { notificationShow } from "../Root/actions";
import {
  getAssignmentsUIProps,
  getCourseProps,
  getCurrentUserProps
} from "./selectors";
import AddTextSolutionDialog from "../../components/AddTextSolutionDialog";
import DeleteAssignmentDialog from "../../components/DeleteAssignmentDialog";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";

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
    ui: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    firebase: PropTypes.object,
    auth: PropTypes.object,
    courseMembers: PropTypes.object
  };

  // Force show assignments (when become participant)
  state = {
    showAssignments: false
  };

  onAddAssignmentClick = () => {
    this.props.dispatch(assignmentShowAddDialog());
  };

  handleTabChange = (event, tabIndex) => {
    this.props.dispatch(assignmentSwitchTab(tabIndex));
  };

  handlePasswordChange = event =>
    this.setState({
      value: event.currentTarget.value
    });

  createAssignment = () => {
    /** @type AssignmentProps */
    const { dispatch, course, ui } = this.props;

    dispatch(assignmentAddRequest(course.id, ui.dialog.value));
  };

  onDeleteAssignment = assignment => {
    this.props.dispatch(assignmentDeleteRequest(assignment));
  };

  updateNewAssignmentField = field => e => {
    this.props.dispatch(updateNewAssignmentField(field, e.target.value));
  };

  onUpdateAssignment = (assignmentId, field, value) => {
    const { course } = this.props;

    coursesService.updateAssignment(course.id, assignmentId, field, value);
  };

  submitPassword = () => {
    const { course } = this.props;

    coursesService.tryCoursePassword(course.id, this.state.value);
  };

  onSortClick = assignment => {
    this.props.dispatch(
      assignmentsSortChange((assignment && assignment.id) || "studentName")
    );
  };

  onProfileCommit = value => {
    const { course, ui } = this.props;

    coursesService.submitSolution(course.id, ui.currentAssignment, value);
  };

  onSubmitClick = (assignment, solution) => {
    const course = this.props.course;

    switch (assignment.questionType) {
      case "CodeCombat":
        coursesService.submitSolution(course.id, assignment, "Complete");
        break;
      default:
        this.props.dispatch(assignmentSubmitRequest(assignment, solution));
    }
  };

  onAcceptClick = (assignment, studentId) => {
    coursesService.acceptSolution(this.props.course.id, assignment, studentId);
  };

  showError = error => this.props.dispatch(notificationShow(error));

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

  getInstructorTab() {
    /** @type AssignmentProps */
    const { course, ui, currentUser } = this.props;

    switch (ui.currentTab) {
      case INSTRUCTOR_TAB_ASSIGNMENTS:
        return (
          <AssignmentsTable
            instructorView={false}
            sortState={ui.sortState}
            currentUser={currentUser}
            course={course}
            onSortClick={this.onSortClick}
            onSubmitClick={this.onSubmitClick}
          />
        );
      case INSTRUCTOR_TAB_EDIT:
        return (
          <Fragment>
            <AssignmentsEditorTable
              onAddAssignmentClick={this.onAddAssignmentClick}
              onDeleteAssignmentClick={this.onDeleteAssignment}
              onUpdateAssignment={this.onUpdateAssignment}
              assignments={course.assignments || {}}
            />
            <AddAssignmentDialog
              userAchievements={currentUser.achievements}
              assignment={ui.dialog && ui.dialog.value}
              onFieldChange={this.updateNewAssignmentField}
              onCommit={this.createAssignment}
              onClose={this.closeDialog}
              open={ui.dialog && ui.dialog.type === "AddAssignment"}
            />
            <DeleteAssignmentDialog
              courseId={course.id}
              assignment={ui.dialog && ui.dialog.value}
              open={ui.dialog && ui.dialog.type === "DeleteAssignment"}
              onClose={this.closeDialog}
            />
          </Fragment>
        );
      case INSTRUCTOR_TAB_VIEW:
        return (
          <AssignmentsTable
            instructorView={true}
            sortState={ui.sortState}
            currentUser={currentUser}
            course={course}
            onAcceptClick={this.onAcceptClick}
            onSortClick={this.onSortClick}
            onSubmitClick={this.onSubmitClick}
          />
        );
      default:
        return <div>Something goes wrong</div>;
    }
  }

  render() {
    const {
      ui,
      classes,
      courseMembers,
      auth,
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
        <Fragment>
          <Tabs
            fullWidth
            indicatorColor="primary"
            textColor="primary"
            value={ui.currentTab}
            onChange={this.handleTabChange}
          >
            <Tab label="Assignments" />
            <Tab label="Edit" />
            <Tab label="Instructor view" />
          </Tabs>
          {this.getInstructorTab()}
        </Fragment>
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
          onError={this.showError}
          onClose={this.closeDialog}
          onCommit={this.onProfileCommit}
        />
        <AddTextSolutionDialog
          open={ui.dialog && ui.dialog.type === "Text"}
          courseId={course.id}
          assignment={ui.currentAssignment}
          onClose={this.closeDialog}
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
      `/courses/${courseId}`,
      `/courseMembers/${courseId}`,
      `/solutions/${courseId}`,
      `/solutions/${courseId}/${uid}`,
      `/visibleSolutions/${courseId}`,
      "/users",
      `/assignments/${courseId}`,
      "/userAchievements"
    ];
  }),
  connect(mapStateToProps)
)(Assignments);
