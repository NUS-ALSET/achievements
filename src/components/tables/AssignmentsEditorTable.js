import {
  assignmentDeleteRequest,
  assignmentQuickUpdateRequest,
  assignmentReorderRequest,
  assignmentShowEditDialog,
  assignmentsEditorTableShown
} from "../../containers/Assignments/actions";
import { isEmpty } from "react-redux-firebase";

import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";

import React from "react";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import withStyles from "@material-ui/core/styles/withStyles";
import { assignmentInfo } from "../../types";

const styles = () => ({
  actionCol: {
    minWidth: 280
  },
  dateEdit: {
    width: 246
  }
});

class AssignmentsEditorTable extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object,
    assignments: PropTypes.arrayOf(assignmentInfo).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    const { assignments } = this.props;
    let result = false;

    if (!(Array.isArray(assignments) && Array.isArray(nextProps.assignments))) {
      return false;
    }

    if (assignments.length !== nextProps.assignments.length) {
      return true;
    }

    assignments.forEach((assignment, index) => {
      const newOne = nextProps.assignments[index];
      for (const field of Object.keys(assignment)) {
        if (
          typeof assignment[field] !== "object" &&
          assignment[field] !== newOne[field]
        ) {
          result = true;
          return !result;
        }
      }
      return !result;
    });

    return result;
  }

  componentDidMount() {
    this.props.dispatch(
      assignmentsEditorTableShown(this.props.match.params.courseId)
    );
  }

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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Assignment Visible</TableCell>
            <TableCell>Solution Visible</TableCell>
            <TableCell>Open</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell className={classes.actionCol}>Actions</TableCell>
            <TableCell>Resource Link</TableCell>
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
                      this.onUpdateAssignment(assignment.id, "visible", checked)
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
                    className={classes.dateEdit}
                    defaultValue={assignment.open || "2018-01-01T09:00"}
                    InputLabelProps={{
                      shrink: true
                    }}
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
                    className={classes.dateEdit}
                    defaultValue={assignment.deadline}
                    InputLabelProps={{
                      shrink: true
                    }}
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
                <TableCell>
                  <IconButton
                    onClick={() => this.onEditAssignmentClick(assignment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => this.onDeleteAssignmentClick(assignment)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => this.onReorderClick(assignment, false)}
                  >
                    <ExpandLessIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => this.onReorderClick(assignment, true)}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{assignment.details}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(withRouter(AssignmentsEditorTable));
