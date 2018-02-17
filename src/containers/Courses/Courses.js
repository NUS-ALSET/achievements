import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import {
  courseHideDialog,
  courseNewDialogChange,
  courseNewRequest,
  courseRemoveDialogShow,
  courseRemoveRequest,
  courseShowNewDialog,
  courseSwitchTab
} from "./actions";
import AddCourseDialog from "../../components/AddCourseDialog";
import CoursesTable from "../../components/CoursesTable";
import Tabs, { Tab } from "material-ui/Tabs";

import sagas from "./sagas";
import { sagaInjector } from "../../services/saga";

import RemoveCourseDialog from "../../components/RemoveCourseDialog";

const COURSE_TAB_JOINED = 0;
const COURSE_TAB_OWNED = 1;
const COURSE_TAB_PUBLIC = 2;

class Courses extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func,
    dialog: PropTypes.any,
    removingCourse: PropTypes.any,
    newCourseValues: PropTypes.object,
    courses: PropTypes.object,
    myCourses: PropTypes.any,
    joinedCourses: PropTypes.any,
    publicCourses: PropTypes.any,
    firebase: PropTypes.object,
    instructorName: PropTypes.string,
    ownerId: PropTypes.string,
    currentTab: PropTypes.number
  };

  onDeleteCourseClick = courseId => {
    const { dispatch, courses } = this.props;
    const course = courses[courseId];

    if (!course) {
      return console.error("Wrong courseId provided");
    }

    dispatch(courseRemoveDialogShow(courseId, course.name));
  };

  switchTab = (event, tabIndex) => {
    this.props.dispatch(courseSwitchTab(tabIndex));
  };

  showNewCourseDialog = () => {
    this.props.dispatch(courseShowNewDialog());
  };
  closeDialog = () => {
    this.props.dispatch(courseHideDialog());
  };
  removeDialogRequest = course => {
    this.props.dispatch(courseRemoveRequest(course.id));
  };
  newDialogRequest = () => {
    const { dispatch, newCourseValues } = this.props;

    dispatch(courseNewRequest(newCourseValues.name, newCourseValues.password));
  };
  onDialogFieldChange = (field, value) => {
    this.props.dispatch(courseNewDialogChange(field, value));
  };
  render() {
    const {
      auth,
      ownerId,
      newCourseValues,
      removingCourse,
      dialog,
      currentTab,
      publicCourses,
      myCourses,
      joinedCourses
    } = this.props;
    let courses;

    if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    }

    switch (currentTab) {
      case COURSE_TAB_JOINED:
        courses = joinedCourses;
        break;
      case COURSE_TAB_OWNED:
        courses = myCourses;
        break;
      case COURSE_TAB_PUBLIC:
        courses = publicCourses;
        break;
      default:
        return <div>Something goes wrong</div>;
    }

    return (
      <Fragment>
        <Toolbar>
          <Button raised onClick={() => this.showNewCourseDialog()}>
            Add new course
          </Button>
        </Toolbar>
        <Tabs
          fullWidth
          indicatorColor="primary"
          textColor="primary"
          value={currentTab}
          onChange={this.switchTab}
        >
          <Tab label="Joined courses" />
          <Tab label="My courses" />
          <Tab label="Public courses" />
        </Tabs>
        <CoursesTable
          onDeleteCourseClick={this.onDeleteCourseClick}
          ownerId={ownerId}
          courses={courses || {}}
        />
        <AddCourseDialog
          values={newCourseValues}
          onFieldChange={this.onDialogFieldChange}
          requestCreation={this.newDialogRequest}
          open={dialog === "NEW_COURSE"}
          onClose={this.closeDialog}
        />
        <RemoveCourseDialog
          open={dialog === "REMOVE_COURSE"}
          course={removingCourse}
          onClose={this.closeDialog}
          onCommit={this.removeDialogRequest}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  courses: Object.assign(
    {},
    state.firebase.data.myCourses,
    state.firebase.data.publicCourses,
    state.courses.joinedCourses
  ),
  myCourses: state.firebase.data.myCourses,
  publicCourses: state.firebase.data.publicCourses,
  joinedCourses: state.courses.joinedCourses,
  instructorName: state.firebase.auth.displayName,
  ownerId: state.firebase.auth.uid,
  dialog: state.courses.dialog,
  removingCourse: state.courses.removingCourse,
  newCourseValues: state.courses.newCourseValues,
  currentTab: state.courses.currentTab
});

export default compose(
  firebaseConnect(
    // Pretty dirty hack to get courses fetching after login on `/course` route
    (ownProps, store) => {
      const firebaseAuth = store.getState().firebase.auth;
      return (
        !firebaseAuth.isEmpty && [
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
        ]
      );
    }
  ),
  connect(mapStateToProps)
)(Courses);
