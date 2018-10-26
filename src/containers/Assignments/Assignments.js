import LinearProgress from "@material-ui/core/LinearProgress";
import { withRouter } from "react-router-dom";
import {
  assignmentCloseDialog,
  assignmentRefreshProfilesRequest,
  assignmentSolutionRequest,
  assignmentSwitchTab,
  coursePasswordEnterSuccess,
  courseAssignmentsClose,
  courseAssignmentsOpen,
  assignmentAssistantKeyChange,
  assignmentAddAssistantRequest,
  assignmentsSolutionsRefreshRequest,
  assignmentsShowHiddenToggle,
  assignmentRemoveAssistantRequest
} from "./actions";
import { compose } from "redux";
import { connect } from "react-redux";
import { ASSIGNMENTS_TYPES, coursesService } from "../../services/courses";
import { firebaseConnect } from "react-redux-firebase";
import {
  getAssignmentsUIProps,
  getCourseProps,
  getCurrentUserProps
} from "./selectors";
import { sagaInjector } from "../../services/saga";

import AddProfileDialog from "../../components/dialogs/AddProfileDialog";
import AddTextSolutionDialog from "../../components/dialogs/AddTextSolutionDialog";
import AssignmentsTable from "../../components/tables/AssignmentsTable";
import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";
import InstructorTabs from "../../components/tabs/InstructorTabs";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import sagas from "./sagas";
import ControlAssistantsDialog from "../../components/dialogs/ControlAssistantsDialog";
import RemoveStudentDialog from "../../components/dialogs/RemoveStudentDialog";
import AddPathActivitySolutionDialog from "../../components/dialogs/AddPathActivitySolutionDialog";
import MoveStudentDialog from "../../components/dialogs/MoveStudentDialog";
import AddPathProgressSolutionDialog from "../../components/dialogs/AddPathProgressSolutionDialog";
import AddAssignmentDialog from "../../components/dialogs/AddAssignmentDialog";
import Breadcrumbs from "../../components/Breadcrumbs";
import { courseInfo } from "../../types/index";

class Assignments extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func,
    classes: PropTypes.any,
    course: courseInfo,
    currentUser: PropTypes.object.isRequired,
    // Required only for password setting. Probably should be changed
    firebase: PropTypes.any,
    match: PropTypes.object,
    readOnly: PropTypes.bool,
    ui: PropTypes.object.isRequired
  };
  state = {
    password: ""
  };

  componentDidMount() {
    this.props.dispatch(
      courseAssignmentsOpen(this.props.match.params.courseId)
    );
  }

  componentWillUnmount() {
    this.props.dispatch(
      courseAssignmentsClose(this.props.match.params.courseId)
    );
  }

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

  onPathProblemSolutionCommit = value => {
    const { course, ui, dispatch } = this.props;

    dispatch(
      assignmentSolutionRequest(course.id, ui.currentAssignment.id, value)
    );
    // this.closeDialog();
  };

  closeDialog = () => {
    this.props.dispatch(assignmentCloseDialog());
  };

  commitTextSolution = (solution, taskId) => {
    const { course, dispatch } = this.props;

    dispatch(assignmentSolutionRequest(course.id, taskId, solution));
    dispatch(assignmentCloseDialog());
  };

  refreshProfileSolutions = () =>
    this.props.dispatch(assignmentRefreshProfilesRequest(this.props.course.id));
  refreshSolutions = () =>
    this.props.dispatch(
      assignmentsSolutionsRefreshRequest(this.props.course.id)
    );
  toggleHiddenShow = () =>
    this.props.dispatch(assignmentsShowHiddenToggle(this.props.course.id));
  onAddAssistant = (courseId, assistantId) =>
    this.props.dispatch(assignmentAddAssistantRequest(courseId, assistantId));
  onAssistantKeyChange = assistantKey =>
    this.props.dispatch(assignmentAssistantKeyChange(assistantKey));
  onRemoveAssistant = (courseId, assistantId) =>
    this.props.dispatch(
      assignmentRemoveAssistantRequest(courseId, assistantId)
    );

  getPasswordView() {
    return (
      <Fragment>
        <TextField
          autoFocus
          fullWidth
          label="Enter password"
          onChange={this.handlePasswordChange}
          onKeyPress={e => {
            if (e.key === "Enter") {
              this.submitPassword();
            }
          }}
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
    const { ui, auth, dispatch, course, currentUser, readOnly } = this.props;

    if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    } else if (!course) {
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
        <Breadcrumbs
          action={
            (currentUser.isAssistant && [
              {
                label: "Refresh",
                handler: this.refreshSolutions
              },
              {
                label: ui.showHiddenAssignments ? "Hide closed" : "Show closed",
                handler: this.toggleHiddenShow
              }
            ]) ||
            null
          }
          paths={[
            {
              label: "Courses",
              link: "/courses"
            },
            {
              label: course.name
            }
          ]}
        />
        <Typography
          gutterBottom
          style={{
            marginLeft: 30
          }}
        >
          Course Description: {course.description || "None provided"}
        </Typography>
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
          externalProfile={{
            url: "https://codecombat.com",
            name: "CodeCombat",
            id: "CodeCombat"
          }}
          onClose={this.closeDialog}
          onCommit={this.onProfileCommit}
          open={ui.dialog && ui.dialog.type === "Profile"}
          uid={currentUser.id}
        />
        {currentUser.isAssistant && (
          <ControlAssistantsDialog
            assistants={(ui.dialog && ui.dialog.assistants) || []}
            isOwner={currentUser.isOwner}
            newAssistant={ui.dialog && ui.dialog.newAssistant}
            onAddAssistant={this.onAddAssistant}
            onAssistantKeyChange={this.onAssistantKeyChange}
            onClose={this.closeDialog}
            onRemoveAssistant={this.onRemoveAssistant}
            open={ui.dialog && ui.dialog.type === "CourseAssistants"}
            target={course.id}
          />
        )}
        <AddTextSolutionDialog
          onClose={this.closeDialog}
          onCommit={this.commitTextSolution}
          open={
            ui.dialog &&
            [
              ASSIGNMENTS_TYPES.TeamFormation.id,
              ASSIGNMENTS_TYPES.TeamText.id,
              ASSIGNMENTS_TYPES.Text.id
            ].includes(ui.dialog.type)
          }
          solution={ui.dialog && ui.dialog.value}
          taskId={ui.currentAssignment && ui.currentAssignment.id}
        />
        <AddPathActivitySolutionDialog
          assignment={ui.currentAssignment}
          dispatch={dispatch}
          loadingSolution={!!ui.dialog && ui.dialog.loadingSolution}
          onCommit={this.onPathProblemSolutionCommit}
          open={
            ui.dialog &&
            ["PathActivity", "PathProblem"].includes(ui.dialog.type)
          }
          pathProblem={ui.dialog.pathProblem}
          readOnly={readOnly}
          solution={ui.dialog.solution}
        />
        <AddPathProgressSolutionDialog
          assignment={ui.currentAssignment}
          courseId={course.id}
          dispatch={dispatch}
          open={ui.dialog && ui.dialog.type === "PathProgress"}
          pathProgress={ui.dialog && ui.dialog.pathProgress}
        />
        <AddAssignmentDialog
          activities={(ui.dialog && ui.dialog.activities) || []}
          assignment={ui.dialog && ui.dialog.value}
          course={course}
          dispatch={dispatch}
          open={ui.dialog && ui.dialog.type === "AddAssignment"}
          paths={(ui.dialog && ui.dialog.paths) || {}}
          teamFormations={(ui.dialog && ui.dialog.teamFormations) || []}
          uid={currentUser && currentUser.id}
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
  assistants: state.assignments.assistants,
  readOnly: state.problem && state.problem.readOnly
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => {
    const courseId = ownProps.match.params.courseId;
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return [];
    }

    return [
      `/courses/${courseId}`,
      `/courseAssistants/${courseId}`,
      `/solutions/${courseId}`,
      `/solutions/${courseId}/${uid}`,
      `/visibleSolutions/${courseId}`,
      `/assignments/${courseId}`
    ];
  }),
  connect(mapStateToProps)
)(Assignments);
