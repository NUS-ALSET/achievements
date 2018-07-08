/**
 * @file AddAssignmentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.01.18
 */

import { APP_SETTING } from "../../achievementsApp/config";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { ASSIGNMENTS_TYPES } from "../../services/courses";
import {
  assignmentAddRequest,
  assignmentCloseDialog,
  assignmentManualUpdateField,
  updateNewAssignmentField
} from "../../containers/Assignments/actions";

class AddAssignmentDialog extends React.PureComponent {
  static propTypes = {
    uid: PropTypes.any,
    courseId: PropTypes.any,
    assignment: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    paths: PropTypes.array.isRequired,
    problems: PropTypes.array.isRequired
  };

  manualChangeField = field => e =>
    this.props.dispatch(assignmentManualUpdateField(field, e.target.value));
  updateField = field => e =>
    this.props.dispatch(updateNewAssignmentField(field, e.target.value));
  onClose = () => this.props.dispatch(assignmentCloseDialog());
  onCommit = () => {
    const { courseId, dispatch, assignment } = this.props;

    dispatch(assignmentAddRequest(courseId, assignment));
  };

  getAssignmentSpecificFields(assignment) {
    let { paths, problems, uid } = this.props;

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
              onChange={this.updateField("level")}
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
            onChange={this.updateField("count")}
            type="number"
            value={assignment.count}
          />
        );
      case ASSIGNMENTS_TYPES.PathActivity.id:
        return (
          <Fragment>
            <TextField
              fullWidth
              label="Path"
              onChange={this.updateField("path")}
              select
              value={assignment.path || uid}
            >
              <MenuItem value={uid}>Default</MenuItem>
              {paths.map(path => (
                <MenuItem key={path.id} value={path.id}>
                  {path.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Activity"
              onChange={this.updateField("problem")}
              select
              value={assignment.problem || ""}
            >
              {problems.map(problem => (
                <MenuItem key={problem.id} value={problem.id}>
                  {problem.name}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={assignment.allowSolutionImport || false}
                  onChange={e =>
                    this.updateField("allowSolutionImport")({
                      target: {
                        value: e.target.checked
                      }
                    })
                  }
                  value="allowSolutionImport"
                />
              }
              label="Allow import existing path solution"
            />
          </Fragment>
        );
      case ASSIGNMENTS_TYPES.PathProgress.id:
        return (
          <TextField
            fullWidth
            label="Path"
            onChange={this.updateField("path")}
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
    let { assignment, open } = this.props;
    assignment = assignment || {};

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {assignment.id ? "Edit Assignment" : "New Assignment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Type of question"
            margin="normal"
            onChange={this.updateField("questionType")}
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
            onChange={this.updateField("name")}
            onKeyPress={this.manualChangeField("name")}
            value={assignment.name || ""}
          />
          <TextField
            fullWidth
            label="Details/Links"
            margin="normal"
            onChange={this.updateField("details")}
            onKeyPress={this.manualChangeField("details")}
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
            onChange={this.updateField("open")}
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
            onChange={this.updateField("deadline")}
            type="datetime-local"
            value={assignment.deadline || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onCommit} variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddAssignmentDialog;
