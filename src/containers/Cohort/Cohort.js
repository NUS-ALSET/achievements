/**
 * @file Cohort container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";

import { firebaseConnect } from "react-redux-firebase";

import CohortCoursesTable from "../../components/tables/CohortCoursesTable";
import {
  cohortCloseDialog,
  cohortCoursesRecalculateRequest,
  cohortCourseUpdateRequest,
  cohortOpen,
  cohortOpenAssistantsDialog,
  cohortUpdateAssistantsRequest
} from "./actions";
import { sagaInjector } from "../../services/saga";

import withStyles from "@material-ui/core/styles/withStyles";

import sagas from "./sagas";
import { cohort } from "../../types";

import Breadcrumbs from "../../components/Breadcrumbs";
import { USER_STATUSES } from "../../types/constants";
import { selectUserStatus } from "./selectors";
import ControlAssistantsDialog from "../../components/dialogs/ControlAssistantsDialog";
import { assignmentAssistantKeyChange } from "../Assignments/actions";
import CohortTabs from "../../components/tabs/CohortTabs";
import DeleteConfirmationDialog from "../../components/dialogs/DeleteConfirmationDialog";

const styles = theme => ({
  breadcrumbLink: {
    textDecoration: "none"
  },
  breadcrumbText: {
    margin: theme.spacing.unit,
    textTransform: "uppercase",
    fontSize: "0.875rem"
  },
  toolbarItem: {
    margin: theme.spacing.unit
  }
});

const COHORT_TAB_COMMON = 0;
const COHORT_TAB_EDIT = 1;
const COHORT_TAB_INSTRUCTOR = 2;

class Cohort extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    classes: PropTypes.object,
    cohort: cohort,
    courses: PropTypes.object,
    currentUser: PropTypes.object,
    match: PropTypes.object,
    ui: PropTypes.object
  };

  state = {
    deletingCourseId: "",
    selectedCourse: "",
    tabIndex: COHORT_TAB_COMMON
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(cohortOpen(match.params.cohortId));
  }

  selectCourse = e => this.setState({ selectedCourse: e.target.value });

  addAssistant = (cohortId, assistantId) =>
    this.props.dispatch(
      cohortUpdateAssistantsRequest(cohortId, assistantId, "add")
    );

  addCourse = () => {
    const { cohort, dispatch } = this.props;

    dispatch(
      cohortCourseUpdateRequest(cohort.id, this.state.selectedCourse, "add")
    );
  };

  changeTabIndex = (event, tabIndex) => this.setState({ tabIndex });

  checkAssistant = assistantKey =>
    this.props.dispatch(assignmentAssistantKeyChange(assistantKey));

  closeDialog = () => this.props.dispatch(cohortCloseDialog());

  onRemoveCourseClick = courseId =>
    this.setState({ deletingCourseId: courseId });
  onRemoveAccept = () => {
    const { cohort, dispatch } = this.props;
    const { deletingCourseId } = this.state;

    dispatch(cohortCourseUpdateRequest(cohort.id, deletingCourseId, "remove"));
    this.setState({ deletingCourseId: "" });
  };

  recalculate = () => {
    const { cohort, dispatch } = this.props;
    dispatch(cohortCoursesRecalculateRequest(cohort.id));
  };

  removeAssistant = (cohortId, assistantId) =>
    this.props.dispatch(
      cohortUpdateAssistantsRequest(cohortId, assistantId, "remove")
    );

  showAssistantsDialog = () =>
    this.props.dispatch(cohortOpenAssistantsDialog(this.props.cohort.id));

  render() {
    const { dispatch, classes, cohort, courses, currentUser, ui } = this.props;
    const tabIndex = this.state.tabIndex;

    if (!cohort) {
      return <div>Loading</div>;
    }

    const isOwner = currentUser.uid && currentUser.uid === cohort.owner;

    return (
      <Fragment>
        <Breadcrumbs
          paths={[
            {
              label: "Cohorts",
              link: "/cohorts"
            },
            {
              label: cohort.name
            }
          ]}
        />
        <Typography
          gutterBottom
          style={{
            marginLeft: 30
          }}
        >
          {cohort.description || "No description"}
        </Typography>
        {[USER_STATUSES.owner, USER_STATUSES.assistant].includes(
          currentUser.status
        ) && <CohortTabs onChange={this.changeTabIndex} tabIndex={tabIndex} />}
        {[COHORT_TAB_INSTRUCTOR, COHORT_TAB_EDIT].includes(tabIndex) && (
          <Toolbar>
            {tabIndex === COHORT_TAB_EDIT && (
              <Fragment>
                <TextField
                  className={classes.toolbarItem}
                  label="Course"
                  onChange={this.selectCourse}
                  select
                  style={{
                    width: 320,
                    marginTop: 0
                  }}
                  value={this.state.selectedCourse}
                >
                  {Object.keys(courses || {})
                    .map(id => ({ ...courses[id], id }))
                    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                    .map(course => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))}
                </TextField>
                <Button
                  className={classes.toolbarItem}
                  onClick={this.addCourse}
                  variant="contained"
                >
                  Add
                </Button>
              </Fragment>
            )}
            {tabIndex === COHORT_TAB_INSTRUCTOR && (
              <Fragment>
                <Button
                  className={classes.toolbarItem}
                  onClick={this.recalculate}
                  variant="contained"
                >
                  Recalculate
                </Button>
                {currentUser.status === USER_STATUSES.owner && (
                  <Button
                    className={classes.toolbarButton}
                    onClick={this.showAssistantsDialog}
                    variant="contained"
                  >
                    Collaborators
                  </Button>
                )}
              </Fragment>
            )}
          </Toolbar>
        )}
        <DeleteConfirmationDialog
          message="This will remove course from cohort"
          onClose={() => this.setState({ deletingCourseId: "" })}
          onCommit={this.onRemoveAccept}
          open={!!this.state.deletingCourseId}
        />
        <ControlAssistantsDialog
          assistants={cohort.assistants}
          newAssistant={ui.newAssistant}
          onAddAssistant={this.addAssistant}
          onAssistantKeyChange={this.checkAssistant}
          onClose={this.closeDialog}
          onRemoveAssistant={this.removeAssistant}
          open={ui.dialog === "Assistants"}
          target={cohort.id}
        />
        <CohortCoursesTable
          cohort={cohort}
          courses={cohort.courses}
          dispatch={dispatch}
          isEdit={tabIndex === COHORT_TAB_EDIT}
          isInstructor={tabIndex === COHORT_TAB_INSTRUCTOR}
          isOwner={isOwner}
          onRemoveClick={this.onRemoveCourseClick}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  courses: Object.assign(
    {},
    state.firebase.data.myCourses,
    state.firebase.data.publicCourses
  ),
  cohort: state.cohort.cohort,
  currentUser: {
    uid: state.firebase.auth.uid,
    name: state.firebase.auth.displayName,
    status: selectUserStatus(state)
  },
  ui: state.cohort.ui
});

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const firebaseAuth = state.firebase.auth;

    if (!firebaseAuth.uid) {
      return [];
    }

    return [
      {
        path: "/courses",
        storeAs: "myCourses",
        queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
      },
      {
        path: "/courses",
        storeAs: "publicCourses",
        queryParams: ["orderByChild=isPublic", "equalTo=true"]
      }
    ];
  }),
  connect(mapStateToProps)
)(Cohort);
