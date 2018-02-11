import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import {
  courseHideNewDialog,
  courseNewDialogChange,
  courseNewRequest,
  courseShowNewDialog
} from "./actions";
import AddCourseDialog from "../../components/AddCourseDialog";
import CoursesTable from "../../components/CoursesTable";
import { coursesService } from "../../services/courses";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import sagas from "./sagas";
import { sagaInjector } from "../../services/saga";
import DeleteCourseDialog from "../../components/DeleteCourseDialog";

class Courses extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func,
    showNewDialog: PropTypes.bool,
    newCourseValues: PropTypes.object,
    courses: PropTypes.any,
    firebase: PropTypes.object,
    instructorName: PropTypes.string,
    ownerId: PropTypes.string
  };

  state = {
    confirmation: {
      open: false,
      message: "",
      resolve: () => {}
    }
  };

  onDeleteCourseClick = courseId => {
    this.showConfirmation("Are you sure you want to remove the course?").then(
      result => {
        if (result) {
          coursesService.deleteCourse(courseId);
        }
        this.closeConfirmation();
      }
    );
  };

  showConfirmation = message => {
    return new Promise(resolve =>
      this.setState({
        confirmation: {
          open: true,
          message,
          resolve
        }
      })
    );
  };

  closeConfirmation = () => {
    this.setState({
      confirmation: {
        open: false,
        message: "",
        resolve: () => {}
      }
    });
  };

  showNewCourseDialog = () => {
    this.props.dispatch(courseShowNewDialog());
  };
  closeNewCourseDialog = () => {
    this.props.dispatch(courseHideNewDialog());
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
      showNewDialog
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
          open={showNewDialog}
          requestClose={this.closeNewCourseDialog}
        />
        <DeleteCourseDialog
          open={false}
          course={null}
          onClose={() => {}}
          onCommit={() => {}}
        />
        <ConfirmationDialog
          message={this.state.confirmation.message}
          open={this.state.confirmation.open}
          resolve={this.state.confirmation.resolve}
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
  showNewDialog: state.courses.showNewDialog,
  newCourseValues: state.courses.newCourseValues
});

export default compose(firebaseConnect(["courses"]), connect(mapStateToProps))(
  Courses
);
