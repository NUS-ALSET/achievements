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
  courseRemoveStudentRequest,
  courseMoveStudentRequest,
  assignmentAssistantKeyChange,
  assignmentAddAssistantRequest,
  assignmentsSolutionsRefreshRequest,
  assignmentsShowHiddenToggle,
  assignmentRemoveAssistantRequest,
  assignmentsAssistantsShowRequest,
  assignmentShowAddDialog
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
import AddFeedbackSolutionDialog from "../../components/dialogs/AddFeedbackSolutionDialog";
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
import MessageDialog from "../../components/dialogs/MessageDialog";

class Assignments extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    assignmentsAssistantsShowRequest: PropTypes.func,
    assignmentShowAddDialog: PropTypes.func,
    assignmentCloseDialog: PropTypes.func,
    courseRemoveStudentRequest: PropTypes.func,
    courseMoveStudentRequest: PropTypes.func,
    dispatch: PropTypes.func,
    classes: PropTypes.any,
    course: courseInfo,
    courseAssignmentsOpen: PropTypes.func,
    courseAssignmentsClose: PropTypes.func,
    currentUser: PropTypes.object.isRequired,
    assignmentSwitchTab: PropTypes.func,
    // Required only for password setting. Probably should be changed
    firebase: PropTypes.any,
    match: PropTypes.object,
    readOnly: PropTypes.bool,
    ui: PropTypes.object.isRequired,
    fieldAutoUpdated: PropTypes.bool,
    isAdmin: PropTypes.bool,
    pathProblem: PropTypes.any
  };
  state = {
    password: "",
    messageModalOpen: false
  };

  componentDidMount() {
    this.props.courseAssignmentsOpen(this.props.match.params.courseId);
  }

  componentWillUnmount() {
    this.props.courseAssignmentsClose(this.props.match.params.courseId);
  }

  handleTabChange = (event, tabIndex) => {
    this.props.assignmentSwitchTab(tabIndex);
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
    const { course, ui, dispatch, pathProblem } = this.props;

    dispatch(
      assignmentSolutionRequest(course.id, ui.currentAssignment.id, value, {
        pathProblem
      })
    );
    // this.closeDialog();
  };

  closeDialog = () => {
    this.props.assignmentCloseDialog();
  };

  commitTextSolution = (solution, taskId) => {
    const { course, dispatch } = this.props;

    dispatch(assignmentSolutionRequest(course.id, taskId, solution));
    assignmentCloseDialog();
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
  toggleMessageModal = () => {
    this.setState(state => ({
      messageModalOpen: !state.messageModalOpen
    }));
  };

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
                  variant="contained"
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
      auth,
      assignmentsAssistantsShowRequest,
      assignmentShowAddDialog,
      assignmentCloseDialog,
      courseRemoveStudentRequest,
      courseMoveStudentRequest,
      dispatch,
      course,
      currentUser,
      readOnly,
      fieldAutoUpdated,
      isAdmin
    } = this.props;
    if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    } else if (!course) {
      if (course === null) {
        return <p>Something wrong!</p>;
      }
      return <LinearProgress />;
    }
    // Default view with password enter
    let AssignmentView = this.getPasswordView();
    // If owner match user id then we suppose use as instructor and give him special view
    if ((currentUser && currentUser.isAssistant) || isAdmin) {
      AssignmentView = (
        <InstructorTabs
          closeDialog={this.closeDialog}
          course={course}
          currentUser={currentUser}
          dispatch={dispatch}
          handleAddAssignmentDialog={assignmentShowAddDialog}
          handleShowAssistants={assignmentsAssistantsShowRequest}
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
            (currentUser &&
              (ui.currentTab === 1 // Edit tab
                ? [
                    {
                      label: "Refresh",
                      handler: this.refreshSolutions
                    },
                    {
                      label: "Message",
                      handler: this.toggleMessageModal
                    }
                  ]
                : [
                    {
                      label: ui.showHiddenAssignments
                        ? "Hide closed"
                        : "Show closed",
                      handler: this.toggleHiddenShow
                    },
                    {
                      label: "Refresh",
                      handler: this.refreshSolutions
                    },
                    {
                      label: "Message",
                      handler: this.toggleMessageModal
                    }
                  ])) || [
              {
                label: "Message",
                handler: this.toggleMessageModal
              }
            ]
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
          handleCloseDialog={assignmentCloseDialog}
          handleRemoveStudentRequest={courseRemoveStudentRequest}
          open={ui && ui.dialog && ui.dialog.type === "RemoveStudent"}
        />
        <MoveStudentDialog
          courseId={course.id}
          courses={(ui && ui.dialog && ui.dialog.courses) || []}
          handleCloseDialog={assignmentCloseDialog}
          handleMOVEStudentRequest={courseMoveStudentRequest}
          open={ui && ui.dialog && ui.dialog.type === "MoveStudent"}
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
          open={ui && ui.dialog && ui.dialog.type === "Profile"}
          uid={currentUser && currentUser.id}
        />
        {((currentUser && currentUser.isAssistant) || isAdmin) && (
          <ControlAssistantsDialog
            assistants={(ui && ui.dialog && ui.dialog.assistants) || []}
            isAdmin={isAdmin}
            isOwner={currentUser && currentUser.isOwner}
            newAssistant={ui && ui.dialog && ui.dialog.newAssistant}
            onAddAssistant={this.onAddAssistant}
            onAssistantKeyChange={this.onAssistantKeyChange}
            onClose={this.closeDialog}
            onRemoveAssistant={this.onRemoveAssistant}
            open={ui && ui.dialog && ui.dialog.type === "CourseAssistants"}
            target={course.id}
          />
        )}
        <AddTextSolutionDialog
          onClose={this.closeDialog}
          onCommit={this.commitTextSolution}
          open={
            ui &&
            ui.dialog &&
            [
              ASSIGNMENTS_TYPES.TeamFormation.id,
              ASSIGNMENTS_TYPES.TeamText.id,
              ASSIGNMENTS_TYPES.Text.id,
              ASSIGNMENTS_TYPES.TeamChoice.id
            ].includes(ui.dialog.type)
          }
          options={ui && ui.dialog && ui.dialog.options}
          solution={ui && ui.dialog && ui.dialog.value}
          taskId={ui && ui.currentAssignment && ui.currentAssignment.id}
        />
        <AddFeedbackSolutionDialog
          onClose={this.closeDialog}
          onCommit={this.commitTextSolution}
          open={
            ui && ui.dialog && ui.dialog.type === ASSIGNMENTS_TYPES.Feedback.id
          }
          options={ui && ui.dialog && ui.dialog.options}
          solution={ui && ui.dialog && ui.dialog.value}
          taskId={ui && ui.currentAssignment && ui.currentAssignment.id}
        />
        <AddPathActivitySolutionDialog
          assignment={ui && ui.currentAssignment}
          dispatch={dispatch}
          loadingSolution={ui && !!ui.dialog && ui.dialog.loadingSolution}
          onCommit={this.onPathProblemSolutionCommit}
          open={
            ui &&
            ui.dialog &&
            ["PathActivity", "PathProblem"].includes(ui.dialog.type)
          }
          pathProblem={ui && ui.dialog && ui.dialog.pathProblem}
          readOnly={readOnly}
          solution={ui && ui.dialog && ui.dialog.solution}
        />
        <AddPathProgressSolutionDialog
          assignment={ui && ui.currentAssignment}
          courseId={course.id}
          dispatch={dispatch}
          open={ui && ui.dialog && ui.dialog.type === "PathProgress"}
          pathProgress={ui && ui.dialog && ui.dialog.pathProgress}
        />
        <AddAssignmentDialog
          activities={(ui && ui.dialog && ui.dialog.activities) || []}
          assignment={ui && ui.dialog && ui.dialog.value}
          course={course}
          dispatch={dispatch}
          fieldAutoUpdated={fieldAutoUpdated}
          open={ui && ui.dialog && ui.dialog.type === "AddAssignment"}
          paths={(ui && ui.dialog && ui.dialog.paths) || {}}
          teamFormations={(ui && ui.dialog && ui.dialog.teamFormations) || []}
          uid={currentUser && currentUser.id}
        />
        <MessageDialog
          course={course}
          handleClose={this.toggleMessageModal}
          isInstructor={currentUser && currentUser.isAssistant}
          open={this.state.messageModalOpen}
          showStudents={true}
          type={"course"}
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
  readOnly: (state.problem || {}).readOnly,
  fieldAutoUpdated: state.assignments.fieldAutoUpdated,
  isAdmin: state.account.isAdmin,
  pathProblem: (state.problem || {}).pathProblem
});

const mapDispatchToProps = dispatch => ({
  assignmentsAssistantsShowRequest: courseId =>
    dispatch(assignmentsAssistantsShowRequest(courseId)),
  assignmentShowAddDialog: () => dispatch(assignmentShowAddDialog()),
  assignmentCloseDialog: () => dispatch(assignmentCloseDialog()),
  assignmentSwitchTab: tabIndex => dispatch(assignmentSwitchTab(tabIndex)),
  courseAssignmentsOpen: courseId => dispatch(courseAssignmentsOpen(courseId)),
  courseAssignmentsClose: courseId =>
    dispatch(courseAssignmentsClose(courseId)),
  courseRemoveStudentRequest: (courseId, studentId) =>
    dispatch(courseRemoveStudentRequest(courseId, studentId)),
  courseMoveStudentRequest: (sourceCourseId, targetCourseId, studentId) =>
    dispatch(
      courseMoveStudentRequest(sourceCourseId, targetCourseId, studentId)
    ),
  dispatch
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Assignments);
