/**
 * @file AddPathProgressSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";

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

class AddPathProgressSolutionDialog extends React.PureComponent {
  static propTypes = {
    assignment: PropTypes.any,
    courseId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    pathProgress: PropTypes.any,
    activityPath: PropTypes.object.isRequired
  };

  getProgress = () => {
    const { pathProgress, activityPath } = this.props;
    const totalActivities = Number(activityPath.totalActivities);

    if (!(pathProgress && totalActivities && pathProgress.solutions)) {
      return "none";
    }
    return `${pathProgress.solutions} of ${totalActivities}`;
  };

  getProgressMessage = () => {
    const { pathProgress, activityPath } = this.props;
    const totalActivities = Number(activityPath.totalActivities);

    if (!(pathProgress && totalActivities && pathProgress.solutions)) {
      return `Your have no progress at this "${activityPath.name}" path`;
    }
    return `You have completed ${
      pathProgress.solutions
    } of the ${totalActivities} activities on the "${activityPath.name}" path.
    Your progress is ${this.getProgress()}.`;
  };

  onProblemChange = problemSolution => this.setState({ problemSolution });

  onClose = () => this.props.dispatch(assignmentCloseDialog());

  onGotoLink = () => {
    const { assignment } = this.props;
    window.open(`/#/paths/${assignment.path}`, "_blank");
    this.onClose();
  };

  onCommit = () => {
    this.props.dispatch(
      assignmentSolutionRequest(
        this.props.courseId,
        this.props.assignment.id,
        this.getProgress()
      )
    );
    this.onClose();
  };

  render() {
    const { open, pathProgress, activityPath } = this.props;

    const totalActivities = Number(activityPath.totalActivities);

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>Add Path Progress Status</DialogTitle>
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
          <Button color="primary" onClick={this.onGotoLink} variant="outlined">
            Go to Path
          </Button>
          {pathProgress && totalActivities && pathProgress.solutions && (
            <Button color="primary" onClick={this.onCommit} variant="contained">
              Update Progress
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  activityPath:
    (state.firebase.data.paths || {})[(ownProps.assignment || {}).path] || {}
});

export default compose(
  firebaseConnect((ownProps, store) =>
    ownProps.assignment ? [`/paths/${ownProps.assignment.path}`] : []
  ),
  connect(mapStateToProps)
)(AddPathProgressSolutionDialog);
