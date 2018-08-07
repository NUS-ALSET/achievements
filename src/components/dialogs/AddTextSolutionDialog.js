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

class AddTextSolutionDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    solution: PropTypes.any,

    taskId: PropTypes.string
  };

  state = {
    solution: ""
  };

  onChangeSolution = event => {
    this.setState({
      solution: event.target.value
    });
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
            defaultValue={(solution && solution.value) || ""}
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
            onClick={() => onCommit(this.state.solution, taskId)}
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
