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

// RegExp rules
import { NoStartWhiteSpace, KeyboardInputs } from "../regexp-rules/RegExpRules";

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
    // validate inputs
    isCorrectInput: false
  };

  onChangeSolution = event => {
    // validate inputs
    if (
      KeyboardInputs.test(event.target.value) &&
      NoStartWhiteSpace.test(event.target.value)
    ) {
      this.setState({
        isCorrectInput: true,
        solution: event.target.value.trim()
      });
    } else {
      this.setState({
        isCorrectInput: false
      });
    }
  };

  render() {
    const { onClose, onCommit, open, solution, taskId } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Text Solution</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={(solution && solution.value) || ""}
            error={!this.state.isCorrectInput}
            fullWidth
            helperText={
              this.state.isCorrectInput
                ? ""
                : "input should not be empty or have invalid characters"
            }
            label="Solution"
            onChange={this.onChangeSolution}
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
            onClick={() => {
              onCommit((this.state.solution || "").trim(), taskId);
              this.setState({
                isCorrectInput: false
              });
            }}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddTextSolutionDialog;
