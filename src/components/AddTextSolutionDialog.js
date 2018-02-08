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

  onCommitClick = () => {
    const { courseId, assignment } = this.props;

    coursesService.submitSolution(courseId, assignment, this.state.solution);
    this.props.onClose();
  };

  render() {
    const { onClose, open } = this.props;

    return (
      <Dialog open={open}>
        <DialogTitle>New Assignment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            style={{
              width: 320
            }}
            label="Solution"
            value={this.state.solution}
            onChange={this.onChangeSolution}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onCommitClick}>
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddTextSolutionDialog;
