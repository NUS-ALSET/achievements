import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { isEmpty } from "react-redux-firebase";

import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Switch from "material-ui/Switch";
import TextField from "material-ui/TextField";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";

import EditIcon from "material-ui-icons/Edit";
import DeleteIcon from "material-ui-icons/Delete";
import ExpandLessIcon from "material-ui-icons/ExpandLess";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";

const dateEditStyle = {
  width: "220px"
};

class AssignmentsEditorTable extends React.PureComponent {
  static propTypes = {
    assignments: PropTypes.any.isRequired,
    onUpdateAssignment: PropTypes.func.isRequired,
    onAddAssignmentClick: PropTypes.func.isRequired,
    onDeleteAssignmentClick: PropTypes.func.isRequired
  };

  render() {
    const { onAddAssignmentClick, onDeleteAssignmentClick } = this.props;

    return (
      <Fragment>
        <Toolbar>
          <Button raised onClick={() => onAddAssignmentClick()}>
            Add assignment
          </Button>
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Assignment Visible</TableCell>
              <TableCell>Solution Visible</TableCell>
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
                <TableCell>Empty list</TableCell>
              </TableRow>
            ) : (
              this.props.assignments.map(assignment => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>
                    <Switch
                      onChange={(event, checked) =>
                        this.props.onUpdateAssignment(
                          assignment.id,
                          "visible",
                          checked
                        )
                      }
                      checked={assignment.visible}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      onChange={(event, checked) =>
                        this.props.onUpdateAssignment(
                          assignment.id,
                          "solutionVisible",
                          checked
                        )
                      }
                      checked={assignment.solutionVisible}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      style={dateEditStyle}
                      type="datetime-local"
                      onChange={event =>
                        this.props.onUpdateAssignment(
                          assignment.id,
                          "deadline",
                          event.target.value
                        )
                      }
                      defaultValue={assignment.deadline}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </TableCell>
                  <TableCell>{assignment.details}</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon
                        onClick={() => onAddAssignmentClick(assignment)}
                      />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon
                        onClick={() => onDeleteAssignmentClick(assignment)}
                      />
                    </IconButton>
                    <IconButton>
                      <ExpandLessIcon />
                    </IconButton>
                    <IconButton>
                      <ExpandMoreIcon />
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

export default AssignmentsEditorTable;
