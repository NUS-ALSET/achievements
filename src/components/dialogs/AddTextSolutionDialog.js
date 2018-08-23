/**
 * @file AddTextSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 07.02.18
 */

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";

/* AddTextSolutionDialog is currently used for:
 * ASSIGNMENTS_TYPES.TeamFormation.id,
 * ASSIGNMENTS_TYPES.TeamText.id,
 * ASSIGNMENTS_TYPES.Text.id
 * so only allow for printable characters as input
 */

class AddTextSolutionDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    solution: PropTypes.any,

    taskId: PropTypes.string
  };

  state = {
    solution: "",
    // detect if text input is only printable characters,
    // if so CorrentInput
    isCorrectInput: true,
  };

  onChangeSolution = event => {
    // if text input has non-keyboard characters,
    // or start with empty space,
    // or has only empty spaces =>
    // disable the commit button
    // Regex from Olafs Vandans
    if (/^[^\s][a-zA-Z0-9\t\n ./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]*$/
      .test(event.target.value)
    ) {
      this.setState({
        isCorrectInput: true,
        solution: event.target.value,
      });
    } else {
      this.setState({
        isCorrectInput: false
      });
    }
  };

  catchReturn = event =>
    event.key === "Enter" &&
    this.props.onCommit(this.state.solution, this.props.taskId);

  render() {
    const { onClose, onCommit, open, solution, taskId } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Text Solution</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={!this.state.isCorrectInput}
            defaultValue={(solution && solution.value) || ""}
            helperText={this.state.isCorrectInput
              ? ""
              : "input cannot be empty and should has only valid characters"}
            fullWidth
            label="Solution"
            onChange={this.onChangeSolution}
            onKeyPress={this.catchReturn}
            style={{
              width: 320
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!this.state.isCorrectInput}
            onClick={() => onCommit((this.state.solution || "").trim(), taskId)}
            variant="raised"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddTextSolutionDialog;
