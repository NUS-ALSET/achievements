/**
 * @file AddTextSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 07.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { coursesService } from "../services/courses";

class AddTextSolutionDialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    solution: PropTypes.any,

    courseId: PropTypes.string.isRequired,
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
    const { courseId, assignment } = this.props;

    if (event.key !== "Enter") {
      return;
    }
    coursesService.submitSolution(courseId, assignment, this.state.solution);
    this.props.onClose();
  };

  onCommitClick = () => {
    const { courseId, assignment } = this.props;

    coursesService.submitSolution(courseId, assignment, this.state.solution);
    this.props.onClose();
  };

  render() {
    const { onClose, open, solution } = this.props;

    return (
      <Dialog open={open} onClose={onClose}>
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
          <Button color="secondary" onClick={onClose}>
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
