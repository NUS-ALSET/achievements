/**
 * @file AddPathProgressSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import CircularProgress from "material-ui/Progress/CircularProgress";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Typography from "material-ui/Typography";
import {
  assignmentCloseDialog,
  assignmentSolutionRequest
} from "../../containers/Assignments/actions";

const FULL_PROGRESS = 100;

class AddPathProgressSolutionDialog extends React.PureComponent {
  static propTypes = {
    assignmentId: PropTypes.any,
    courseId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    pathProgress: PropTypes.any
  };

  getProgress = () => {
    const pathProgress = this.props.pathProgress;

    if (!(pathProgress && pathProgress.total && pathProgress.solutions)) {
      return "No progress";
    }
    return `${pathProgress.solutions / pathProgress.total * FULL_PROGRESS}%`;
  };
  getProgressMessage = () => {
    const pathProgress = this.props.pathProgress;

    if (!(pathProgress && pathProgress.total && pathProgress.solutions)) {
      return "Your have no progress at this path";
    }
    return `There are ${pathProgress.total} problem at required path. You
    solved ${
      pathProgress.solutions
    } of them. Your progress is ${this.getProgress()}`;
  };

  onProblemChange = problemSolution => this.setState({ problemSolution });
  onClose = () => this.props.dispatch(assignmentCloseDialog());
  onCommit = () => {
    this.props.dispatch(
      assignmentSolutionRequest(
        this.props.courseId,
        this.props.assignmentId,
        this.getProgress()
      )
    );
    this.onClose();
  };

  render() {
    const { open, pathProgress } = this.props;

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>Add Path Progress Solution Status</DialogTitle>
        <DialogContent>
          {pathProgress ? (
            <Typography>{this.getProgressMessage()}</Typography>
          ) : (
            <div
              style={{
                textAlign: "center",
                width: "100%"
              }}
            >
              <CircularProgress />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onCommit} variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddPathProgressSolutionDialog;
