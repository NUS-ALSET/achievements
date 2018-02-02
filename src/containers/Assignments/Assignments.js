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

const testAssignments = [
  {
    studentName: "Chris",
    assignment: "Test Assignment 1",
    team: "Team 1"
  },
  {
    studentName: "Chris",
    assignment: "Test Assignment 2",
    team: "Team 1"
  },
  {
    studentName: "Doug",
    assignment: "Test Assignment 1",
    team: (
      <Button raised assignment="TestAssignment1" student="Doug">
        Submit
      </Button>
    )
  },
  {
    studentName: "Doug",
    assignment: "Test Assignment 2",
    team: "Team 1"
  },
  {
    studentName: "Ellen",
    assignment: "Test Assignment 1",
    team: "Team 1"
  },
  {
    studentName: "Ellen",
    assignment: "Test Assignment 2",
    team: (
      <Button raised assignment="TestAssignment2" student="Ellen">
        Submit
      </Button>
    )
  },
  {
    studentName: "Ginger",
    assignment: "Test Assignment 1",
    team: "Team 1"
  },
  {
    studentName: "Ginger",
    assignment: "Test Assignment 2",
    team: "Team 1"
  }
];

const testAssignmentDefinitions = {
  test1: {
    name: "Test Assignment 1",
    open: new Date(),
    close: new Date(),
    visible: true
  },
  test2: {
    name: "Test Assignment 2",
    open: new Date(),
    close: new Date(),
    visible: false,
    solutionVisible: true
  }
};

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
    courseMembers: PropTypes.object,
    history: PropTypes.any,
    currentTab: PropTypes.number,
    userAchievements: PropTypes.object
  };

  // Force show assignments (when become participant)
  state = {
    showAssignments: false,
    currentTab: 0,
    dialogOpen: false
  };

  handleAssignmentAddRequest = () => {
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

  submitPassword = () => {
    const { courseId } = this.props;

    coursesService.tryCoursePassword(courseId, this.state.value);
  };
  render() {
    const {
      history,
      course,
      courseLoaded,
      classes,
      courseMembers,
      userId,
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
          instructorTab = <AssignmentsTable assignments={testAssignments} />;
          break;
        case INSTRUCTOR_TAB_EDIT:
          instructorTab = (
            <Fragment>
              <AssignmentsEditorTable
                addAssignmentHandler={this.handleAssignmentAddRequest}
                assignments={testAssignmentDefinitions}
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
    } else if (courseMembers && courseMembers[this.props.userId]) {
      // Otherwise - just provide list of assignments for student-member
      AssignmentView = (
        <Fragment>
          <Toolbar>
            <Button raised>Create assignment</Button>
          </Toolbar>
          <AssignmentsTable assignments={testAssignments} />
        </Fragment>
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

const mapStateToProps = (state, ownProps) => {
  return {
    currentTab: state.assignments.currentTab,
    userId: state.firebase.auth.uid,
    courseLoaded: isLoaded(state.firebase.data.courseMembers),
    courseId: ownProps.match.params.courseId,
    courseMembers: (state.firebase.data.courseMembers || {})[
      ownProps.match.params.courseId
    ],
    userAchievements: (state.firebase.data.userAchievements || {})[
      state.firebase.auth.uid
    ],
    course:
      isLoaded(state.firebase.data.courses) &&
      state.firebase.data.courses[ownProps.match.params.courseId]
  };
};

export default compose(
  withRouter,
  withStyles(styles),
  firebaseConnect((props, store) => [
    "/courseMembers",
    `/userAchievements/${store.getState().firebase.auth.uid}`
  ]),
  connect(mapStateToProps)
)(Assignments);
