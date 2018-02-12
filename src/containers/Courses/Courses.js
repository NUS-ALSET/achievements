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
  courseShowNewDialog
} from "./actions";
import AddCourseDialog from "../../components/AddCourseDialog";
import CoursesTable from "../../components/CoursesTable";
import sagas from "./sagas";
import { sagaInjector } from "../../services/saga";
import RemoveCourseDialog from "../../components/RemoveCourseDialog";

class Courses extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func,
    dialog: PropTypes.any,
    removingCourse: PropTypes.any,
    newCourseValues: PropTypes.object,
    courses: PropTypes.any,
    firebase: PropTypes.object,
    instructorName: PropTypes.string,
    ownerId: PropTypes.string
  };

  onDeleteCourseClick = courseId => {
    const { dispatch, courses } = this.props;
    const course = courses[courseId];

    if (!course) {
      return console.error("Wrong courseId provided");
    }

    dispatch(courseRemoveDialogShow(courseId, course.name));
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
      courses,
      ownerId,
      newCourseValues,
      removingCourse,
      dialog
    } = this.props;
    if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    }

    return (
      <Fragment>
        <Toolbar>
          <Button raised onClick={() => this.showNewCourseDialog()}>
            Add new course
          </Button>
        </Toolbar>
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
          requestClose={this.closeDialog}
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
  courses: state.firebase.data.courses,
  instructorName: state.firebase.auth.displayName,
  ownerId: state.firebase.auth.uid,
  dialog: state.courses.dialog,
  removingCourse: state.courses.removingCourse,
  newCourseValues: state.courses.newCourseValues
});

export default compose(firebaseConnect(["courses"]), connect(mapStateToProps))(
  Courses
);
