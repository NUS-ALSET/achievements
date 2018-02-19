/**
 * @file InstructorTabs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.02.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Tabs, { Tab } from "material-ui/Tabs";
import AssignmentsTable from "./AssignmentsTable";
import AddAssignmentDialog from "./AddAssignmentDialog";
import DeleteAssignmentDialog from "./DeleteAssignmentDialog";
import AssignmentsEditorTable from "./AssignmentsEditorTable";
import {
  assignmentAddRequest,
  updateNewAssignmentField
} from "../containers/Assignments/actions";

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
            dispatch={dispatch}
            sortState={ui.sortState}
            currentUser={currentUser}
            course={course}
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
              onFieldChange={this.onUpdateNewAssignmentField}
              onCommit={this.onCreateAssignmentClick}
              onClose={closeDialog}
              open={ui.dialog && ui.dialog.type === "AddAssignment"}
            />
            <DeleteAssignmentDialog
              courseId={course.id}
              assignment={(ui.dialog && ui.dialog.value) || false}
              open={ui.dialog && ui.dialog.type === "DeleteAssignment"}
              onClose={closeDialog}
            />
          </Fragment>
        );
      case INSTRUCTOR_TAB_VIEW:
        return (
          <AssignmentsTable
            dispatch={dispatch}
            sortState={ui.sortState}
            currentUser={currentUser}
            course={course}
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
          textColor="primary"
          value={ui.currentTab}
          onChange={handleTabChange}
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
