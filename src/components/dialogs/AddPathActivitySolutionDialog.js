/**
 * @file AddPathProblemSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import { assignmentCloseDialog } from "../../containers/Assignments/actions";

import withStyles from "@material-ui/core/styles/withStyles";

import isEmpty from "lodash/isEmpty";
import Activity from "../../containers/Activity/Activity";
import { problemFinalize } from "../../containers/Activity/actions";

const styles = () => ({
  dialog: {
    minWidth: "80%",
    height: "80%",
    transition: "all 0.5s ease !important"
  },
  progress: {
    position: "fixed",
    top: 64,
    left: 0,
    width: "100%",
    zIndex: 10000
  },
  loading: { transition: "all 0.5s ease !important" }
});

class AddPathActivitySolutionDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    pathProblem: PropTypes.any,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    solution: PropTypes.any
  };

  state = {
    problemSolution: {}
  };

  onProblemChange = problemSolution => {
    this.setState({ problemSolution });
  };

  resetState = () => {
    this.setState({ problemSolution: {} });
  };

  onClose = () => {
    this.resetState();
    this.props.dispatch(problemFinalize());
    this.props.dispatch(assignmentCloseDialog());
  };

  onCommitClick = (data = null) => {
    const solution =
      data && data.type === "SOLUTION"
        ? data.solution
        : this.state.problemSolution;
    isEmpty(solution) ? this.onClose() : this.props.onCommit(solution);
  };

  render() {
    const { classes, open, pathProblem, solution, readOnly } = this.props;
    const { problemSolution } = this.state;
    return (
      <Fragment>
        <Dialog
          classes={{
            paper: pathProblem ? classes.dialog : classes.loading
          }}
          fullScreen
          onClose={this.onClose}
          open={open}
        >
          <DialogTitle>
            {readOnly ? "Student " : "Edit "}
            Assignment Solution {readOnly ? "( Read Only) " : ""}
          </DialogTitle>
          <Activity
            embedded={true}
            inDialog={true}
            onClose={this.onClose}
            onCommit={this.onCommitClick}
            onProblemChange={this.onProblemChange}
            pathProblem={pathProblem}
            readOnly={readOnly}
            solution={solution}
          >
            {(activityView, submitHandler, props) => (
              <Fragment>
                <DialogContent
                  style={{
                    overflowX: "hidden"
                  }}
                >
                  {activityView(props)}
                </DialogContent>
                <DialogActions>
                  {/* TODO: refactor =>
                  the problemSolution state seems to be shared among multiple activities
                  listed in the same course page */}
                  {!readOnly &&
                    !["jupyter", "jupyterInline"].includes(
                      (props.pathProblem || {}).type
                    ) && (
                      <Button
                        color="primary"
                        disabled={
                          !(typeof problemSolution === "object"
                            ? problemSolution.hasOwnProperty("value")
                              ? problemSolution.value.trim()
                              : !isEmpty(problemSolution)
                            : problemSolution)
                        }
                        onClick={submitHandler}
                        variant="contained"
                      >
                        Commit
                      </Button>
                    )}
                </DialogActions>
              </Fragment>
            )}
          </Activity>
          <Button color="secondary" onClick={this.onClose}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AddPathActivitySolutionDialog);
