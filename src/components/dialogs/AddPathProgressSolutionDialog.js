/**
 * @file AddPathProgressSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.03.18
 */

import React from "react";
import PropTypes from "prop-types";

// redirect Go To Path
import { Link } from "react-router-dom";

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
    pathProgress: PropTypes.any
  };

  getProgress = () => {
    const { pathProgress, activityPath } = this.props;
    const totalActivities = Number(activityPath.totalActivities);

    if (
      !(pathProgress && totalActivities && pathProgress.solutions)
    ) {
      return "No progress";
    }
    return `${pathProgress.solutions} of ${totalActivities}`;
  };

  getProgressMessage = () => {
    const { pathProgress, activityPath } = this.props;
    const totalActivities = Number(activityPath.totalActivities);

    if (
      !(pathProgress && totalActivities && pathProgress.solutions)
    ) {
      return "Your have no progress at this path";
    }
    return `You have solved ${pathProgress.solutions} of the ${
      totalActivities
    } requested problems on the path ${activityPath.name}.
    Your progress is ${this.getProgress()}
    `;
  };

  onProblemChange = problemSolution => this.setState({ problemSolution });

  onClose = () => this.props.dispatch(assignmentCloseDialog());

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
    const {
      open,
      pathProgress,
      assignment
    } = this.props;

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
          {assignment &&
            <Button
              component={Link}
              to={`/paths/${assignment.path}`}
              variant="outlined"
              color="primary"
            >
              Go to Path
            </Button>
          }
          <Button color="primary" onClick={this.onCommit} variant="raised">
            Add Status
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  activityPath : (state.firebase.data.paths || {})[(ownProps.assignment || {}).path] || {}
});


export default compose(
  firebaseConnect((ownProps, store) => {
    const  pathId= ownProps.assignment ? ownProps.assignment.path : null;
    if(pathId){
      return [
          `/paths/${pathId}`,
      ]
    }
    return [];
  }),
  connect(mapStateToProps)
)(AddPathProgressSolutionDialog);