/**
 * @file InstructorTabs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.02.18
 */

import PropTypes from "prop-types";
import React, { Fragment } from "react";

import { withRouter } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Zoom from "@material-ui/core/Zoom";

import { APP_SETTING } from "../../achievementsApp/config";

import AddIcon from "@material-ui/icons/Add";
import GroupIcon from "@material-ui/icons/Group";

import AssignmentsEditorTable from "../tables/AssignmentsEditorTable";
import AssignmentsTable from "../tables/AssignmentsTable";
import DeleteAssignmentDialog from "../dialogs/DeleteAssignmentDialog";
import {
  assignmentsAssistantsShowRequest,
  assignmentShowAddDialog
} from "../../containers/Assignments/actions";

const INSTRUCTOR_TAB_ASSIGNMENTS = 0;
const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

const styles = theme => ({
  buttonAction: {
    marginRight: theme.spacing.unit
  }
});

class InstructorTabs extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    ui: PropTypes.object,
    uiDialog: PropTypes.object,
    course: PropTypes.object,
    currentUser: PropTypes.object,
    match: PropTypes.object.isRequired,

    dispatch: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired
  };

  shouldComponentUpdate(newProps) {
    const { ui, uiDialog, course } = this.props;
    switch (true) {
      case ui !== newProps.ui:
      case course !== newProps.course:
      case uiDialog.type !== newProps.uiDialog.type:
        return true;
      default:
        return false;
    }
  }

  getInstructorTab() {
    /** @type AssignmentProps */
    const {
      classes,
      closeDialog,
      course,
      currentUser,
      dispatch,
      ui,
      uiDialog
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
            {APP_SETTING.isSuggesting ? (
              <Fragment>
                <Zoom in={true} unmountOnExit>
                  <Button
                    color="primary"
                    onClick={() => this.onAddAssignmentClick()}
                    style={{
                      backfaceVisibility: "hidden",
                      position: "fixed",
                      bottom: 20,
                      right: 20
                    }}
                    variant="fab"
                  >
                    <AddIcon />
                  </Button>
                </Zoom>
                <Zoom in={true} unmountOnExit>
                  <Button
                    onClick={this.assignmentsAssistantsShowRequest}
                    style={{
                      backfaceVisibility: "hidden",
                      position: "fixed",
                      bottom: 80,
                      right: 20
                    }}
                    variant="fab"
                  >
                    <GroupIcon />
                  </Button>
                </Zoom>
              </Fragment>
            ) : (
              <Toolbar>
                <Button
                  className={classes.buttonAction}
                  color="primary"
                  onClick={this.onAddAssignmentClick}
                  variant="raised"
                >
                  Add assignment
                </Button>
                <Button
                  className={classes.buttonAction}
                  onClick={this.assignmentsAssistantsShowRequest}
                  variant="raised"
                >
                  Assistants
                </Button>
              </Toolbar>
            )}
            <AssignmentsEditorTable
              assignments={course.assignments || {}}
              dispatch={dispatch}
            />
            <DeleteAssignmentDialog
              assignment={(uiDialog && uiDialog.value) || false}
              courseId={course.id}
              onClose={closeDialog}
              open={uiDialog && uiDialog.type === "DeleteAssignment"}
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

  onAddAssignmentClick = () => this.props.dispatch(assignmentShowAddDialog());
  assignmentsAssistantsShowRequest = () =>
    this.props.dispatch(
      assignmentsAssistantsShowRequest(this.props.match.params.courseId)
    );

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

export default withStyles(styles)(withRouter(InstructorTabs));
