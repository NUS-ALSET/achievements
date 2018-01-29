/**
 * @file AddAssignmentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.01.18
 */

import React from "react";
import PropTypes from "prop-types";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Button from "material-ui/Button";
import Radio from "material-ui/Radio";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/Menu/MenuItem";
import { FormControlLabel, FormLabel } from "material-ui/Form";

class AddAssignmentDialog extends React.PureComponent {
  static propTypes = {
    handleCommit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };
  state = {
    questionType: "short"
  };
  handleChange = event => {
    this.setState({ questionType: event.target.value });
  };

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>New Assignment</DialogTitle>
        <DialogContent>
          <div>
            <FormLabel>Type of Question</FormLabel>
          </div>
          <FormControlLabel
            onChange={this.handleChange}
            checked={this.state.questionType === "short"}
            value="short"
            control={<Radio />}
            label="Short answer"
          />
          <FormControlLabel
            onChange={this.handleChange}
            checked={this.state.questionType === "essay"}
            value="essay"
            control={<Radio />}
            label="Essay"
          />
          <TextField autoFocus margin="normal" label="Name" fullWidth />
          <TextField margin="normal" label="Details/Links" fullWidth />
          {this.state.questionType === "essay" ? (
            <TextField
              fullWidth
              margin="normal"
              select
              value="Path 1"
              label="Choose Path"
            >
              <MenuItem>Path 1</MenuItem>
            </TextField>
          ) : (
            undefined
          )}
          <TextField
            fullWidth
            label="Open"
            margin="normal"
            type="datetime-local"
            defaultValue="2017-05-24T10:30"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Close"
            type="datetime-local"
            defaultValue="2017-05-24T10:30"
            InputLabelProps={{
              shrink: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
          <Button onClick={this.props.handleCommit}>Commit</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddAssignmentDialog;
