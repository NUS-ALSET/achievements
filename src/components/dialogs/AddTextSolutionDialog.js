/**
 * @file AddTextSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 07.02.18
 */

import {
  assignmentCloseDialog,
  assignmentSolutionRequest
} from "../../containers/Assignments/actions";
import Button from "material-ui/Button";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import PropTypes from "prop-types";
import React from "react";
import TextField from "material-ui/TextField";

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

  catchReturn = event => {
    if (event.key !== "Enter") {
      return;
    }
    this.onCommitClick();
  };

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
      <Dialog open={open} onClose={this.onClose}>
        <DialogTitle>Set Assignment Solution</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            style={{
              width: 320
            }}
            label="Solution"
            defaultValue={(solution && solution.value) || ""}
            onChange={this.onChangeSolution}
            onKeyPress={this.catchReturn}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button raised color="primary" onClick={this.onCommitClick}>
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddTextSolutionDialog;
