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
import CohortQualifiedConditionsList from "../../components/lists/CohortQualifiedConditionsList";
import {
  cohortCloseDialog,
  cohortCoursesRecalculateRequest,
  cohortCourseUpdateRequest,
  cohortOpen,
  cohortOpenAssistantsDialog,
  cohortSortChange,
  cohortUpdateAssistantsRequest,
  setCohortQualificationConditionRequest,
  cohortRecalculateQualifiedMembersRequest
} from "./actions";
import { sagaInjector } from "../../services/saga";

import withStyles from "@material-ui/core/styles/withStyles";

import sagas from "./sagas";
import { cohort } from "../../types";

import Breadcrumbs from "../../components/Breadcrumbs";
import { USER_STATUSES } from "../../types/constants";
import { selectUserStatus, selectCohort, calculateRanking } from "./selectors";
import ControlAssistantsDialog from "../../components/dialogs/ControlAssistantsDialog";
import { assignmentAssistantKeyChange } from "../Assignments/actions";
import CohortTabs from "../../components/tabs/CohortTabs";
import DeleteConfirmationDialog from "../../components/dialogs/DeleteConfirmationDialog";
import MessageDialog from "../../components/dialogs/MessageDialog";
import QualifiedConditionsDialog from "../../components/dialogs/QualifiedConditionsDialog";

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
    tabIndex: COHORT_TAB_COMMON,
    messageModalOpen: false,
    openQualifiedConditionsDialog: false
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
  onSortChange = sortField => this.props.dispatch(cohortSortChange(sortField));

  onRemoveAccept = () => {
    const { cohort, dispatch } = this.props;
    const { deletingCourseId } = this.state;

    dispatch(cohortCourseUpdateRequest(cohort.id, deletingCourseId, "remove"));
    this.setState({ deletingCourseId: "" });
  };

  recalculate = () => {
    const { cohort, dispatch } = this.props;
    dispatch(cohortCoursesRecalculateRequest(cohort.id));
    dispatch(cohortRecalculateQualifiedMembersRequest(cohort.id));
  };

  removeAssistant = (cohortId, assistantId) =>
    this.props.dispatch(
      cohortUpdateAssistantsRequest(cohortId, assistantId, "remove")
    );

  showAssistantsDialog = () =>
    this.props.dispatch(cohortOpenAssistantsDialog(this.props.cohort.id));

  toggleMessageModal = () => {
    this.setState(state => ({
      messageModalOpen: !state.messageModalOpen
    }))
  }
  showQualifiedConditionDialog = () =>
    this.setState({ openQualifiedConditionsDialog: true });

  closeQualifiedConditionsDialog = () =>
    this.setState({ openQualifiedConditionsDialog: false });

  saveQualifiedCondition = condition => {
    this.props.dispatch(
      setCohortQualificationConditionRequest(this.props.cohort.id, condition)
    );
    this.closeQualifiedConditionsDialog();
  };

  render() {
    const {
      dispatch,
      classes,
      cohort,
      courses,
      currentUser,
      ui,
      cohortMemberQualificationStatus,
      membersPathsRanking
    } = this.props;
    const tabIndex = this.state.tabIndex;
    if (!cohort) {
      return <div>Loading</div>;
    }
    const isOwner = currentUser.uid && currentUser.uid === cohort.owner;

    return (
      <Fragment>
        <Breadcrumbs
          action={
            [
              {
                label: "Message",
                handler: this.toggleMessageModal
              }
            ]
          }
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
                  <Fragment>
                    <Button
                      className={classes.toolbarButton}
                      onClick={this.showAssistantsDialog}
                      variant="contained"
                    >
                      Collaborators
                    </Button>
                    <Button
                      className={classes.toolbarButton}
                      onClick={this.showQualifiedConditionDialog}
                      variant="contained"
                    >
                      Set Qualification Condition
                    </Button>
                  </Fragment>
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
          onSortClick={this.onSortChange}
          sortState={ui.sortState}
          membersPathsRanking={membersPathsRanking}
          uid={currentUser.uid}
        />
        <MessageDialog
          cohort={cohort}
          handleClose={this.toggleMessageModal}
          isInstructor={[USER_STATUSES.owner, USER_STATUSES.assistant].includes(
            currentUser.status
          )}
          open={this.state.messageModalOpen}
          showStudents={false}
          type={"cohort"}
        />
        {Object.keys((cohort.qualifiedConditions || {}).pathConditions || {})
          .length > 0 && (
          <CohortQualifiedConditionsList
            qualifiedConditions={
              (cohort.qualifiedConditions || {}).pathConditions
            }
            pathsData={cohort.pathsData}
            cohortMemberQualificationStatus={cohortMemberQualificationStatus}
            uid={currentUser.uid}
            showAllUserStatus={
              tabIndex === COHORT_TAB_INSTRUCTOR &&
              [USER_STATUSES.owner, USER_STATUSES.assistant].includes(
                currentUser.status
              )
            }
          />
        )}

        {isOwner && (
          <QualifiedConditionsDialog
            open={this.state.openQualifiedConditionsDialog}
            qualifiedConditions={
              (cohort.qualifiedConditions || {}).pathConditions
            }
            pathsData={cohort.pathsData}
            handleClose={this.closeQualifiedConditionsDialog}
            saveChanges={this.saveQualifiedCondition}
          />
        )}
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
  cohort: selectCohort(state),
  currentUser: {
    uid: state.firebase.auth.uid,
    name: state.firebase.auth.displayName,
    status: selectUserStatus(state)
  },
  ui: state.cohort.ui,
  cohortMemberQualificationStatus:
    state.firebase.data.cohortMemberQualificationStatus || {},
    membersPathsRanking: calculateRanking(state)
});

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const firebaseAuth = state.firebase.auth;
    const cohortId = ownProps.match.params.cohortId;
    let qualificationStatus = [];
    if (cohortId) {
      qualificationStatus = [
        {
          path: `/cohortMemberQualificationStatus/${cohortId}`,
          storeAs: "cohortMemberQualificationStatus"
        },
        {
          path: `/cohortMembersCompletedActivitiesCountOnPaths/${cohortId}`,
          storeAs: "cohortMembersCompletedActivitiesCountOnPaths"
        }
      ];
    }
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
      },
      ...qualificationStatus
    ];
  }),
  connect(mapStateToProps)
)(Cohort);
