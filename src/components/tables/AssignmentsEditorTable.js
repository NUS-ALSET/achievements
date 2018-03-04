import {
  assignmentDeleteRequest,
  assignmentQuickUpdateRequest,
  assignmentReorderRequest,
  assignmentShowAddDialog,
  assignmentShowEditDialog,
  assignmentsEditorTableShown
} from "../../containers/Assignments/actions";
import { isEmpty } from "react-redux-firebase";

import { withRouter } from "react-router-dom";
import Button from "material-ui/Button";

import DeleteIcon from "material-ui-icons/Delete";
import EditIcon from "material-ui-icons/Edit";
import ExpandLessIcon from "material-ui-icons/ExpandLess";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import IconButton from "material-ui/IconButton";
import PropTypes from "prop-types";

import AddIcon from "material-ui-icons/Add";
import GroupIcon from "material-ui-icons/Group";

import React, { Fragment } from "react";
import Switch from "material-ui/Switch";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import TextField from "material-ui/TextField";
import Toolbar from "material-ui/Toolbar";
import { APP_SETTING } from "../../achievementsApp/config";
import withStyles from "material-ui/styles/withStyles";

const styles = theme => ({
  actionButton: {
    margin: theme.spacing.unit
  },
  actionCol: {
    minWidth: 240
  },
  dateEdit: {
    width: 220
  },
  faButton: {
    position: "fixed",
    bottom: 20,
    right: 20
  }
});

class AssignmentsEditorTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object,
    assignments: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.dispatch(
      assignmentsEditorTableShown(this.props.match.params.courseId)
    );
  }

  onAddAssignmentClick = () => this.props.dispatch(assignmentShowAddDialog());
  onEditAssignmentClick = assignment =>
    this.props.dispatch(assignmentShowEditDialog(assignment));
  onDeleteAssignmentClick = assignment =>
    this.props.dispatch(assignmentDeleteRequest(assignment));
  onUpdateAssignment = (assignmentId, field, value) => {
    this.props.dispatch(
      assignmentQuickUpdateRequest(
        this.props.match.params.courseId,
        assignmentId,
        field,
        value
      )
    );
  };
  onReorderClick = (assignment, order) =>
    this.props.dispatch(
      assignmentReorderRequest(
        this.props.match.params.courseId,
        assignment.id,
        order
      )
    );

  render() {
    const { assignments, classes } = this.props;
    return (
      <Fragment>
        {APP_SETTING.isSuggesting ? (
          <Fragment>
            <Button
              className={classes.faButton}
              color="primary"
              onClick={() => this.onAddAssignmentClick()}
              variant="fab"
            >
              <AddIcon />
            </Button>
            <IconButton onClick={this.assignmentsAssistantsShowRequest}>
              <GroupIcon />
            </IconButton>
          </Fragment>
        ) : (
          <Toolbar>
            <Button
              className={classes.actionButton}
              onClick={() => this.onAddAssignmentClick()}
              variant="raised"
            >
              Add assignment
            </Button>
            <Button
              className={classes.actionButton}
              onClick={this.assignmentsAssistantsShowRequest}
              variant="raised"
            >
              Assistants
            </Button>
          </Toolbar>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Assignment Visible</TableCell>
              <TableCell>Solution Visible</TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Details</TableCell>
              <TableCell className={classes.actionCol}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmpty(assignments) ? (
              <TableRow>
                <TableCell colSpan={7}>Empty list</TableCell>
              </TableRow>
            ) : (
              assignments.map(assignment => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={assignment.visible}
                      color="primary"
                      onChange={(event, checked) =>
                        this.onUpdateAssignment(
                          assignment.id,
                          "visible",
                          checked
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={assignment.solutionVisible}
                      color="primary"
                      onChange={(event, checked) =>
                        this.onUpdateAssignment(
                          assignment.id,
                          "solutionVisible",
                          checked
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      className={classes.dateEdit}
                      defaultValue={assignment.open || "2018-01-01T09:00"}
                      onChange={event =>
                        this.onUpdateAssignment(
                          assignment.id,
                          "open",
                          event.target.value
                        )
                      }
                      type="datetime-local"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      className={classes.dateEdit}
                      defaultValue={assignment.deadline}
                      onChange={event =>
                        this.onUpdateAssignment(
                          assignment.id,
                          "deadline",
                          event.target.value
                        )
                      }
                      type="datetime-local"
                    />
                  </TableCell>
                  <TableCell>{assignment.details}</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon
                        onClick={() => this.onEditAssignmentClick(assignment)}
                      />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon
                        onClick={() => this.onDeleteAssignmentClick(assignment)}
                      />
                    </IconButton>
                    <IconButton>
                      <ExpandLessIcon
                        onClick={() => this.onReorderClick(assignment, false)}
                      />
                    </IconButton>
                    <IconButton>
                      <ExpandMoreIcon
                        onClick={() => this.onReorderClick(assignment, true)}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(AssignmentsEditorTable));
