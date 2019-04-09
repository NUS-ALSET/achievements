/**
 * @file InstructorTabs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.02.18
 */

import PropTypes from "prop-types";
import React, { Fragment } from "react";

import { withRouter } from "react-router-dom";

import Fab from "@material-ui/core/Fab";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Zoom from "@material-ui/core/Zoom";

import AddIcon from "@material-ui/icons/Add";
import GroupIcon from "@material-ui/icons/Group";

import AssignmentsEditorTable from "../tables/AssignmentsEditorTable";
import AssignmentsTable from "../tables/AssignmentsTable";
import DeleteAssignmentDialog from "../dialogs/DeleteAssignmentDialog";

const INSTRUCTOR_TAB_ASSIGNMENTS = 0;
const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

class InstructorTabs extends React.PureComponent {
  static propTypes = {
    ui: PropTypes.object,
    course: PropTypes.object,
    currentUser: PropTypes.object,
    match: PropTypes.object.isRequired,
    // paths: PropTypes.array,
    // problems: PropTypes.array,
    handleAddAssignmentDialog: PropTypes.func,
    handleShowAssistants: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired
  };

  getInstructorTab() {
    /** @type AssignmentProps */
    const {
      course,
      ui,
      currentUser,
      dispatch,
      closeDialog,
      handleAddAssignmentDialog,
      handleShowAssistants
    } = this.props;

    switch (ui.currentTab) {
      case INSTRUCTOR_TAB_ASSIGNMENTS:
        return (
          <AssignmentsTable
            course={course}
            currentUser={currentUser}
            dispatch={dispatch}
            isInstructor={false}
            sortState={ui.sortState}
          />
        );
      case INSTRUCTOR_TAB_EDIT:
        return (
          <Fragment>
            <Zoom in={true} unmountOnExit>
              <Fab
                color="primary"
                onClick={() => handleAddAssignmentDialog()}
                style={{
                  backfaceVisibility: "hidden",
                  position: "fixed",
                  bottom: 20,
                  right: 20,
                  zIndex: 10
                }}
              >
                <AddIcon />
              </Fab>
            </Zoom>
            <Zoom in={true} unmountOnExit>
              <Fab
                onClick={() =>
                  handleShowAssistants(this.props.match.params.courseId)
                }
                style={{
                  backfaceVisibility: "hidden",
                  position: "fixed",
                  bottom: 80,
                  right: 20,
                  zIndex: 10
                }}
              >
                <GroupIcon />
              </Fab>
            </Zoom>
            <AssignmentsEditorTable
              assignments={course.assignments || {}}
              dispatch={dispatch}
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
            isInstructor={true}
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

export default withRouter(InstructorTabs);
