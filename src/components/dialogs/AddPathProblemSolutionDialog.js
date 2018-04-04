/**
 * @file AddPathProblemSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Button from "material-ui/Button";
import { assignmentCloseDialog } from "../../containers/Assignments/actions";
import ProblemView from "../problemViews/ProblemView";

import withStyles from "material-ui/styles/withStyles";

const styles = () => ({
  dialog: {
    minWidth: "80%",
    height: "80%",
    transition: "all 0.5s ease !important"
  },
  loading: { transition: "all 0.5s ease !important" }
});

class AddPathProblemSolutionDialog extends React.PureComponent {
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

  onProblemChange = problemSolution => this.setState({ problemSolution });
  catchReturn = event => event.key === "Enter" && this.onCommitClick();
  onClose = () => this.props.dispatch(assignmentCloseDialog());
  onCommitClick = () => this.props.onCommit(this.state.problemSolution);

  render() {
    const { classes, dispatch, open, pathProblem, solution } = this.props;

    return (
      <Dialog
        classes={{
          paper: pathProblem ? classes.dialog : classes.loading
        }}
        fullWidth
        onClose={this.onClose}
        open={open}
      >
        <DialogTitle>Set Assignment Solution</DialogTitle>
        <DialogContent
          style={{
            textAlign: "center",
            overflowX: "hidden"
          }}
        >
          <ProblemView
            dispatch={dispatch}
            inDialog={true}
            onProblemChange={this.onProblemChange}
            pathProblem={pathProblem}
            solution={solution}
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

export default withStyles(styles)(AddPathProblemSolutionDialog);
