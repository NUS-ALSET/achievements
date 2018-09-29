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
import { cohortsService } from "../../services/cohorts";
import {
  cohortCloseDialog,
  cohortCoursesRecalculateRequest,
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
    selectedCourse: ""
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
    const { cohort } = this.props;

    cohortsService.addCourse(cohort.id, this.state.selectedCourse);
  };

  checkAssistant = assistantKey =>
    this.props.dispatch(assignmentAssistantKeyChange(assistantKey));

  closeDialog = () => this.props.dispatch(cohortCloseDialog());

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

    if (!(currentUser && currentUser.uid)) {
      return <div>Register or Login required to display cohort</div>;
    }

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
          Cohort Description: {cohort.description || "None provided"}
        </Typography>
        {[USER_STATUSES.owner, USER_STATUSES.assistant].includes(
          currentUser.status
        ) && (
          <Toolbar>
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
                .map(course => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
            </TextField>
            <Button
              className={classes.toolbarItem}
              onClick={this.addCourse}
              variant="raised"
            >
              Add
            </Button>
            <Button
              className={classes.toolbarItem}
              onClick={this.recalculate}
              variant="raised"
            >
              Recalculate
            </Button>
            {currentUser.status === USER_STATUSES.owner && (
              <Button
                className={classes.toolbarButton}
                onClick={this.showAssistantsDialog}
                variant="raised"
              >
                Collaborators
              </Button>
            )}
          </Toolbar>
        )}
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
          isOwner={isOwner}
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
