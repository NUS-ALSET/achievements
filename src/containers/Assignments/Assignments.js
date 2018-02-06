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
  assignmentsSortChange,
  assignmentSubmitRequest
} from "./actions";
import AddAssignmentDialog from "../../components/AddAssignmentDialog";
import AddProfileDialog from "../../components/AddProfileDialog";
import { riseErrorMessage } from "../AuthCheck/actions";

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

    // FixIt: decide where public achievements data should be stored and place only it
    allAchievements: PropTypes.object,
    assignments: PropTypes.object,
    solutions: PropTypes.object,
    visibleSolutions: PropTypes.object,
    sortState: PropTypes.object,
    dialog: PropTypes.any
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

  // noinspection JSUnusedGlobalSymbols
  submitSolution = (sourceId, assignment) => {
    coursesService.submitSolution(sourceId, assignment, this.props.userId);
  };

  submitPassword = () => {
    const { courseId } = this.props;

    coursesService.tryCoursePassword(courseId, this.state.value);
  };

  onSortClick = assignment => {
    this.props.dispatch(
      assignmentsSortChange((assignment && assignment.id) || "studentName")
    );
  };

  onSubmitClick = (assignment, solution) => {
    this.props.dispatch(assignmentSubmitRequest(assignment, solution));
  };

  showError = error => this.props.dispatch(riseErrorMessage(error));

  closeDialog = () => {
    this.props.dispatch(assignmentCloseDialog());
  };

  getAssignments = instructorView => {
    const {
      assignments,
      courseMembers,
      users,
      course,
      courseId,
      userName,
      userId,
      allAchievements,
      visibleSolutions,
      sortState
    } = this.props;

    return coursesService.getStudentsAssignments({
      assignments,
      courseMembers,
      users,
      course,
      courseId,
      userName,
      userId,
      visibleSolutions,
      userAchievements: allAchievements,
      instructorView,
      sortState
    });
  };

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
    const {
      assignments,
      userId,
      visibleSolutions,
      sortState,
      userAchievements
    } = this.props;

    switch (this.state.currentTab) {
      case INSTRUCTOR_TAB_ASSIGNMENTS:
        return (
          <AssignmentsTable
            sortState={sortState}
            instructorView={false}
            userId={userId}
            solutions={visibleSolutions}
            assignmentDefinitions={assignments}
            studentAssignments={this.getAssignments(false)}
            onSortClick={this.onSortClick}
            onSubmitClick={this.onSubmitClick}
          />
        );
      case INSTRUCTOR_TAB_EDIT:
        return (
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
      case INSTRUCTOR_TAB_VIEW:
        return (
          <AssignmentsTable
            instructorView={true}
            sortState={sortState}
            userId={userId}
            solutions={visibleSolutions}
            assignmentDefinitions={assignments}
            studentAssignments={this.getAssignments(false)}
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
      history,
      course,
      courseLoaded,
      classes,
      assignments,
      courseMembers,
      userId,
      dialog,
      userName,
      visibleSolutions,
      sortState
    } = this.props;

    if (!courseLoaded) {
      return <LinearProgress />;
    }
    if (!course) {
      history.push("/courses");
    }

    // Default view with password enter
    let AssignmentView = this.getPasswordView();

    // If owner match user id then we suppose use as instructor and give him special view
    if (course.owner === userId) {
      AssignmentView = (
        <Fragment>
          <Tabs
            fullWidth
            indicatorColor="primary"
            textColor="primary"
            value={this.state.currentTab}
            onChange={this.handleTabChange}
          >
            <Tab label="Assignments" />
            <Tab label="Edit" />
            <Tab label="Instructor view" />
          </Tabs>
          {this.getInstructorTab()}
        </Fragment>
      );
    } else if (courseMembers && courseMembers[userId]) {
      // Otherwise - just provide list of assignments for student-member
      AssignmentView = (
        <AssignmentsTable
          sortState={sortState}
          instructorView={false}
          userId={userId}
          studentName={userName}
          solutions={visibleSolutions}
          assignmentDefinitions={assignments}
          studentAssignments={this.getAssignments(false)}
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
          uid={userId}
          defaultValue={(dialog && dialog.value) || ""}
          open={dialog && dialog.type === "Profile"}
          externalProfile={{
            url: "https://codecombat.com",
            id: "CodeCombat"
          }}
          onError={this.showError}
          onClose={this.closeDialog}
        />
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
    dialog: state.assignments.dialog,
    sortState: state.assignments.sort,
    courseMembers: getFrom(state.firebase.data.courseMembers, courseId),
    assignments: getFrom(state.firebase.data.assignments, courseId),
    solutions: getFrom(state.firebase.data.solutions, courseId),
    visibleSolutions: getFrom(state.firebase.data.visibleSolutions, courseId),
    userAchievements: getFrom(state.firebase.data.userAchievements, userId),
    allAchievements: state.firebase.data.userAchievements || {},
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
      `/visibleSolutions/${courseId}`,
      "/users",
      `/assignments/${courseId}`,
      "/userAchievements"
    ];
  }),
  connect(mapStateToProps)
)(Assignments);
