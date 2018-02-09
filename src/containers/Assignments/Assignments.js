import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import withStyles from "material-ui/styles/withStyles";
// import { LinearProgress } from "material-ui/Progress";
import { firebaseConnect } from "react-redux-firebase";
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
  assignmentsSortChange,
  assignmentSubmitRequest,
  assignmentSwitchTab
} from "./actions";
import AddAssignmentDialog from "../../components/AddAssignmentDialog";
import AddProfileDialog from "../../components/AddProfileDialog";
import { riseErrorMessage } from "../AuthCheck/actions";
import { getAssignments } from "./selectors";
import AddTextSolutionDialog from "../../components/AddTextSolutionDialog";
import DeleteAssignmentDialog from "../../components/DeleteAssignmentDialog";

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
    history: PropTypes.any,
    data: PropTypes.object
  };

  // Force show assignments (when become participant)
  state = {
    showAssignments: false,
    dialogOpen: false
  };

  onAddAssignmentClick = () => {
    this.props.dispatch(assignmentAddRequest());
    this.setState({
      dialogOpen: true
    });
  };

  handleTabChange = (event, tabIndex) => {
    this.props.dispatch(assignmentSwitchTab(tabIndex));
  };

  handlePasswordChange = event =>
    this.setState({
      value: event.currentTarget.value
    });

  createAssignment = assignmentDetails => {
    /** @type AssignmentProps */
    const data = this.props.data;

    coursesService.addAssignment(data.course.id, assignmentDetails);
    this.setState({ dialogOpen: false });
  };

  onDeleteAssignment = assignment => {
    // const { data } = this.props;
    // coursesService.removeAssignment(data.course.id, assignment.id);
    this.props.dispatch(assignmentDeleteRequest(assignment));
  };

  onUpdateAssignment = (assignmentId, field, value) => {
    /** @type AssignmentProps */
    const { data } = this.props;

    coursesService.updateAssignment(data.course.id, assignmentId, field, value);
  };

  submitPassword = () => {
    /** @type AssignmentProps */
    const { data } = this.props;

    coursesService.tryCoursePassword(data.course.id, this.state.value);
  };

  onSortClick = assignment => {
    this.props.dispatch(
      assignmentsSortChange((assignment && assignment.id) || "studentName")
    );
  };

  onProfileCommit = value => {
    /** @type AssignmentProps */
    const data = this.props.data;

    coursesService.submitSolution(
      data.course.id,
      data.ui.currentAssignment,
      value
    );
  };

  onSubmitClick = (assignment, solution) => {
    /** @type AssignmentProps */
    const data = this.props.data;

    switch (assignment.questionType) {
      case "CodeCombat":
        coursesService.submitSolution(data.course.id, assignment, "Complete");
        break;
      default:
        this.props.dispatch(assignmentSubmitRequest(assignment, solution));
    }
  };

  onAcceptClick = (assignment, studentId) => {
    coursesService.acceptSolution(
      this.props.data.course.id,
      assignment,
      studentId
    );
  };

  showError = error => this.props.dispatch(riseErrorMessage(error));

  closeDialog = () => {
    this.props.dispatch(assignmentCloseDialog());
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
    /** @type AssignmentProps */
    const data = this.props.data;

    switch (data.ui.currentTab) {
      case INSTRUCTOR_TAB_ASSIGNMENTS:
        return (
          <AssignmentsTable
            instructorView={false}
            sortState={data.ui.sortState}
            currentUser={data.currentUser}
            course={data.course}
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
              assignments={data.course.assignments || {}}
            />
            <AddAssignmentDialog
              userAchievements={data.currentUser.achievements}
              handleCommit={this.createAssignment}
              handleCancel={() => this.setState({ dialogOpen: false })}
              open={this.state.dialogOpen}
            />
            <DeleteAssignmentDialog
              courseId={data.course.id}
              assignment={data.ui.dialog && data.ui.dialog.value}
              open={
                data.ui.dialog && data.ui.dialog.type === "DeleteAssignment"
              }
              onClose={this.closeDialog}
            />
          </Fragment>
        );
      case INSTRUCTOR_TAB_VIEW:
        return (
          <AssignmentsTable
            instructorView={true}
            sortState={data.ui.sortState}
            currentUser={data.currentUser}
            course={data.course}
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
      history,
      classes,
      /** @type AssignmentProps */
      data
    } = this.props;

    // if (!data.course.members) {
    //   return <LinearProgress />;
    // }
    if (!data.course.owner) {
      history.push("/courses");
    }

    // Default view with password enter
    let AssignmentView = this.getPasswordView();

    // If owner match user id then we suppose use as instructor and give him special view
    if (data.course.owner === data.currentUser.id) {
      AssignmentView = (
        <Fragment>
          <Tabs
            fullWidth
            indicatorColor="primary"
            textColor="primary"
            value={data.ui.currentTab}
            onChange={this.handleTabChange}
          >
            <Tab label="Assignments" />
            <Tab label="Edit" />
            <Tab label="Instructor view" />
          </Tabs>
          {this.getInstructorTab()}
        </Fragment>
      );
    } else if (
      data.course.members &&
      data.course.members[data.currentUser.id]
    ) {
      // Otherwise - just provide list of assignments for student-member
      AssignmentView = (
        <AssignmentsTable
          instructorView={false}
          sortState={data.ui.sortState}
          currentUser={data.currentUser}
          course={data.course}
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
            {data.course.name}
          </Typography>
        </Toolbar>
        {AssignmentView}
        <AddProfileDialog
          uid={data.currentUser.id}
          open={data.ui.dialog && data.ui.dialog.type === "Profile"}
          externalProfile={{
            url: "https://codecombat.com",
            id: "CodeCombat"
          }}
          onError={this.showError}
          onClose={this.closeDialog}
          onCommit={this.onProfileCommit}
        />
        <AddTextSolutionDialog
          open={data.ui.dialog && data.ui.dialog.type === "Text"}
          courseId={data.course.id}
          assignment={data.ui.currentAssignment}
          onClose={this.closeDialog}
        />
      </Fragment>
    );
  }
}

/**
 *
 * @param {ReduxState} state
 * @param ownProps
 * @returns {*} props
 */
const mapStateToProps = (state, ownProps) => ({
  data: getAssignments(state, ownProps)
});

export default compose(
  withRouter,
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const courseId = ownProps.match.params.courseId;
    const state = store.getState();
    const course = (state.firebase.data.courses || {})[courseId] || {};
    const uid = state.firebase.auth.uid;
    return [
      `/courseMembers/${courseId}`,
      `/solutions/${courseId}${course.owner === uid ? "" : `/${uid}`}`,
      `/visibleSolutions/${courseId}`,
      "/users",
      `/assignments/${courseId}`,
      "/userAchievements"
    ];
  }),
  connect(mapStateToProps)
)(Assignments);
