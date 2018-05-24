/**
 * @file AddTextSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 07.02.18
 */

import {
  assignmentCloseDialog,
  assignmentSolutionRequest
} from "../../containers/Assignments/actions";
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
    open: PropTypes.bool.isRequired,
    solution: PropTypes.any,

    courseId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    assignment: PropTypes.object
  };

  state = {
    solution: ""
  };

  onChangeSolution = event => {
    this.setState({
      solution: event.target.value
    });
  };

  catchReturn = event => event.key === "Enter" && this.onCommitClick();
  onClose = () => this.props.dispatch(assignmentCloseDialog());

  onCommitClick = () => {
    const { courseId, assignment, dispatch } = this.props;

    dispatch(
      assignmentSolutionRequest(courseId, assignment.id, this.state.solution)
    );
    dispatch(assignmentCloseDialog());
  };

  render() {
    const { open, solution } = this.props;

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>Set Assignment Solution</DialogTitle>
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
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onCommitClick} variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddTextSolutionDialog;
