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

const INSTRUCTOR_TAB_ASSIGNMENTS = 0;
const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

class InstructorTabs extends React.PureComponent {
  static propTypes = {
    ui: PropTypes.object,
    course: PropTypes.object,
    currentUser: PropTypes.object,

    onSortClick: PropTypes.func.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    onAddAssignmentClick: PropTypes.func.isRequired,
    onDeleteAssignment: PropTypes.func.isRequired,
    onUpdateAssignment: PropTypes.func.isRequired,
    onUpdateNewAssignmentField: PropTypes.func.isRequired,
    onCreateAssignmentClick: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    onAcceptClick: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired
  };

  getInstructorTab() {
    /** @type AssignmentProps */
    const {
      course,
      ui,
      currentUser,
      onSortClick,
      onSubmitClick,
      onAddAssignmentClick,
      onDeleteAssignment,
      onUpdateAssignment,
      onCreateAssignmentClick,
      onUpdateNewAssignmentField,
      closeDialog,
      onAcceptClick
    } = this.props;

    switch (ui.currentTab) {
      case INSTRUCTOR_TAB_ASSIGNMENTS:
        return (
          <AssignmentsTable
            instructorView={false}
            sortState={ui.sortState}
            currentUser={currentUser}
            course={course}
            onSortClick={onSortClick}
            onSubmitClick={onSubmitClick}
          />
        );
      case INSTRUCTOR_TAB_EDIT:
        return (
          <Fragment>
            <AssignmentsEditorTable
              onAddAssignmentClick={onAddAssignmentClick}
              onDeleteAssignmentClick={onDeleteAssignment}
              onUpdateAssignment={onUpdateAssignment}
              assignments={course.assignments || {}}
            />
            <AddAssignmentDialog
              assignment={ui.dialog && ui.dialog.value}
              onFieldChange={onUpdateNewAssignmentField}
              onCommit={onCreateAssignmentClick}
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
            instructorView={true}
            sortState={ui.sortState}
            currentUser={currentUser}
            course={course}
            onAcceptClick={onAcceptClick}
            onSortClick={onSortClick}
            onSubmitClick={onSubmitClick}
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
