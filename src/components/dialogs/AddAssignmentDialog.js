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
import React from "react";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";

class AddAssignmentDialog extends React.PureComponent {
  static propTypes = {
    assignment: PropTypes.any,
    onFieldChange: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };
  /*
  handleChange = name => event => {
    // Reset default `name` and `details` for `Profile` question type
    if (
      name === "questionType" &&
      this.state.questionType === "Profile" &&
      event.target.value !== "Profile" &&
      this.state.name === "Enter CodeCombat profile" &&
      this.state.details === "https://codecombat.com/"
    ) {
      this.setState({
        name: "",
        details: ""
      });
    }

    // Set default `name` and `details` for `Profile` question type
    if (
      name === "questionType" &&
      event.target.value === "Profile" &&
      !(this.state.name || this.state.details)
    ) {
      return this.setState({
        questionType: "Profile",
        name: "Enter CodeCombat profile",
        details: "https://codecombat.com/"
      });
    }
  };*/

  render() {
    let { onFieldChange, open, onClose, onCommit, assignment } = this.props;
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
            <MenuItem value="Text">Text</MenuItem>
            <MenuItem value="Profile">Enter Code Combat Profile</MenuItem>
            <MenuItem value="CodeCombat">Complete Code Combat Level</MenuItem>
            <MenuItem value="CodeCombat_Number">
              Complete Number of Code Combat Levels
            </MenuItem>
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
          {assignment.questionType === "CodeCombat" && (
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
          )}
          {assignment.questionType === "CodeCombat_Number" && (
            <TextField
              fullWidth
              label="Levels amount"
              margin="normal"
              onChange={onFieldChange("count")}
              type="number"
              value={assignment.count}
            />
          )}
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
