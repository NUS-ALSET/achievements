/**
 * @file AddPathProgressSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
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

    if (
      !(pathProgress && pathProgress.totalActivities && pathProgress.solutions)
    ) {
      return "No progress";
    }
    return `${pathProgress.solutions /
      pathProgress.totalActivities *
      FULL_PROGRESS}%`;
  };
  getProgressMessage = () => {
    const pathProgress = this.props.pathProgress;

    if (
      !(pathProgress && pathProgress.totalActivities && pathProgress.solutions)
    ) {
      return "Your have no progress at this path";
    }
    return `You have solved ${pathProgress.solutions} of the ${
      pathProgress.totalActivities
    } requested problems on the path. Your progress is ${this.getProgress()}`;
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
