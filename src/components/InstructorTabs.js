/**
 * @file InstructorTabs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.02.18
 */

import {
  assignmentAddRequest,
  updateNewAssignmentField
} from "../containers/Assignments/actions";
import AddAssignmentDialog from "./dialogs/AddAssignmentDialog";
import AssignmentsEditorTable from "./tables/AssignmentsEditorTable";
import AssignmentsTable from "./tables/AssignmentsTable";
import DeleteAssignmentDialog from "./dialogs/DeleteAssignmentDialog";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Tabs, { Tab } from "material-ui/Tabs";

const INSTRUCTOR_TAB_ASSIGNMENTS = 0;
const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

class InstructorTabs extends React.PureComponent {
  static propTypes = {
    ui: PropTypes.object,
    course: PropTypes.object,
    currentUser: PropTypes.object,

    dispatch: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired
  };

  onUpdateNewAssignmentField = field => e =>
    this.props.dispatch(updateNewAssignmentField(field, e.target.value));
  onCreateAssignmentClick = () => {
    const { dispatch, course, ui } = this.props;

    dispatch(assignmentAddRequest(course.id, ui.dialog.value));
  };

  getInstructorTab() {
    /** @type AssignmentProps */
    const { course, ui, currentUser, dispatch, closeDialog } = this.props;

    switch (ui.currentTab) {
      case INSTRUCTOR_TAB_ASSIGNMENTS:
        return (
          <AssignmentsTable
            course={course}
            currentUser={currentUser}
            dispatch={dispatch}
            sortState={ui.sortState}
          />
        );
      case INSTRUCTOR_TAB_EDIT:
        return (
          <Fragment>
            <AssignmentsEditorTable
              assignments={course.assignments || {}}
              dispatch={dispatch}
            />
            <AddAssignmentDialog
              assignment={ui.dialog && ui.dialog.value}
              onClose={closeDialog}
              onCommit={this.onCreateAssignmentClick}
              onFieldChange={this.onUpdateNewAssignmentField}
              open={ui.dialog && ui.dialog.type === "AddAssignment"}
            />
            <DeleteAssignmentDialog
              assignment={(ui.dialog && ui.dialog.value) || false}
              courseId={course.id}
              onClose={closeDialog}
              open={ui.dialog && ui.dialog.type === "DeleteAssignment"}
            />
          </Fragment>
        );
      case INSTRUCTOR_TAB_VIEW:
        return (
          <AssignmentsTable
            course={course}
            currentUser={currentUser}
            dispatch={dispatch}
            sortState={ui.sortState}
          />
        );
      default:
        return <div>Something goes wrong</div>;
    }
  }

  render() {
    const { ui, handleTabChange } = this.props;

    return (
      <Fragment>
        <Tabs
          fullWidth
          indicatorColor="primary"
          onChange={handleTabChange}
          textColor="primary"
          value={ui.currentTab}
        >
          <Tab label="Assignments" />
          <Tab label="Edit" />
          <Tab label="Instructor view" />
        </Tabs>
        {this.getInstructorTab()}
      </Fragment>
    );
  }
}

export default InstructorTabs;
