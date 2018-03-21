/**
 * @file AddAssignmentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.01.18
 */

import { APP_SETTING } from "../../achievementsApp/config";
import { FormControl } from "material-ui/Form";

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Input, { InputLabel } from "material-ui/Input";
import MenuItem from "material-ui/Menu/MenuItem";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import { ASSIGNMENTS_TYPES } from "../../services/courses";

class AddAssignmentDialog extends React.PureComponent {
  static propTypes = {
    assignment: PropTypes.any,
    onFieldChange: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    paths: PropTypes.array.isRequired,
    problems: PropTypes.array.isRequired
  };

  getAssignmentSpecificFields(assignment) {
    let { onFieldChange, paths, problems } = this.props;

    switch (assignment.questionType) {
      case ASSIGNMENTS_TYPES.CodeCombat.id:
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-multiple-levels">Level</InputLabel>
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250
                  }
                }
              }}
              input={<Input id="select-multiple-levels" />}
              margin="none"
              onChange={onFieldChange("level")}
              value={assignment.level || ""}
            >
              {Object.keys(APP_SETTING.levels).map(id => (
                <MenuItem key={APP_SETTING.levels[id].name} value={id}>
                  {APP_SETTING.levels[id].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case ASSIGNMENTS_TYPES.CodeCombat_Number.id:
        return (
          <TextField
            fullWidth
            label="Levels amount"
            margin="normal"
            onChange={onFieldChange("count")}
            type="number"
            value={assignment.count}
          />
        );
      case ASSIGNMENTS_TYPES.PathProblem.id:
        return (
          <Fragment>
            <TextField
              fullWidth
              label="Path"
              onChange={onFieldChange("path")}
              select
              value={assignment.path || "default"}
            >
              <MenuItem value="default">Default</MenuItem>
              {paths.map(path => (
                <MenuItem key={path.id} value={path.id}>
                  {path.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Problem"
              onChange={onFieldChange("problem")}
              select
              value={assignment.problem || ""}
            >
              {problems.map(problem => (
                <MenuItem key={problem.id} value={problem.id}>
                  {problem.name}
                </MenuItem>
              ))}
            </TextField>
          </Fragment>
        );
      case ASSIGNMENTS_TYPES.PathProgress.id:
        return (
          <TextField
            fullWidth
            label="Path"
            onChange={onFieldChange("path")}
            select
            value={assignment.path || "default"}
          >
            <MenuItem value="default">Default</MenuItem>
            {paths.map(path => (
              <MenuItem key={path.id} value={path.id}>
                {path.name}
              </MenuItem>
            ))}
          </TextField>
        );
      default:
    }
  }

  render() {
    let { assignment, onFieldChange, open, onClose, onCommit } = this.props;
    assignment = assignment || {};

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {assignment.id ? "Edit Assignment" : "New Assignment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Type of question"
            margin="normal"
            onChange={onFieldChange("questionType")}
            select
            value={assignment.questionType || ""}
          >
            {Object.keys(ASSIGNMENTS_TYPES).map(key => (
              <MenuItem key={key} value={key}>
                {ASSIGNMENTS_TYPES[key].caption}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            onChange={onFieldChange("name")}
            value={assignment.name || ""}
          />
          <TextField
            fullWidth
            label="Details/Links"
            margin="normal"
            onChange={onFieldChange("details")}
            value={assignment.details || ""}
          />
          {this.getAssignmentSpecificFields(assignment)}
          <TextField
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            label="Open"
            margin="normal"
            onChange={onFieldChange("open")}
            type="datetime-local"
            value={assignment.open || ""}
          />
          <TextField
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            label="Deadline"
            margin="normal"
            onChange={onFieldChange("deadline")}
            type="datetime-local"
            value={assignment.deadline || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={onCommit} variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddAssignmentDialog;
