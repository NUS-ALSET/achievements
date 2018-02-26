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

const dateEditStyle = {
  width: "220px"
};

class AssignmentsEditorTable extends React.PureComponent {
  static propTypes = {
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
    return (
      <Fragment>
        {APP_SETTING.isSuggesting ? (
          <Button
            color="primary"
            onClick={() => this.onAddAssignmentClick()}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20
            }}
            variant="fab"
          >
            <AddIcon />
          </Button>
        ) : (
          <Toolbar>
            <Button
              onClick={() => this.onAddAssignmentClick()}
              variant="raised"
            >
              Add assignment
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
              <TableCell
                style={{
                  minWidth: 240
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmpty(this.props.assignments) ? (
              <TableRow>
                <TableCell colSpan={7}>Empty list</TableCell>
              </TableRow>
            ) : (
              this.props.assignments.map(assignment => (
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
                      defaultValue={assignment.open || "2018-01-01T09:00"}
                      onChange={event =>
                        this.onUpdateAssignment(
                          assignment.id,
                          "open",
                          event.target.value
                        )
                      }
                      style={dateEditStyle}
                      type="datetime-local"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      defaultValue={assignment.deadline}
                      onChange={event =>
                        this.onUpdateAssignment(
                          assignment.id,
                          "deadline",
                          event.target.value
                        )
                      }
                      style={dateEditStyle}
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

export default withRouter(AssignmentsEditorTable);
