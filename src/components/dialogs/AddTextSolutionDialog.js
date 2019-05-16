/**
 * @file AddTextSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 07.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
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
    options: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.bool
    ]),
    solution: PropTypes.any,
    taskId: PropTypes.string,
    problem: PropTypes.object,
    setProblemOpenTime: PropTypes.func
  };

  state = {
    solution: "",
    // validate inputs
    isCorrectInput: false
  };

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line no-unused-expressions
    if (
      JSON.stringify(prevProps.problem) !== JSON.stringify(this.props.problem)
    ) {
      // eslint-disable-next-line no-unused-expressions
      this.props.problem &&
        this.props.setProblemOpenTime &&
        this.props.setProblemOpenTime(
          this.props.problem.id,
          new Date().getTime()
        );
    }
  }

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
    const { onClose, onCommit, open, options, solution, taskId } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Text Solution</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={
              options ? undefined : (solution && solution.value) || ""
            }
            error={!this.state.isCorrectInput}
            fullWidth
            helperText={
              this.state.isCorrectInput
                ? ""
                : "input should not be empty or have invalid characters"
            }
            key={taskId}
            label="Solution"
            onChange={this.onChangeSolution}
            select={!!options}
            style={{
              width: 320
            }}
            value={
              options
                ? this.state.solution || (solution && solution.value) || ""
                : undefined
            }
          >
            {options &&
              options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>
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
