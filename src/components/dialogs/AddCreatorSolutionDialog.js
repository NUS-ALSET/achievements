/**
 * @file AddCreatorSolutionDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 15.11.18
 */

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";

const styles = {
  minWidthEditor: {
    minWidth: 320
  }
};

class AddCreatorSolutionDialog extends React.PureComponent {
  static propTypes = {
    pathsInfo: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    solution: PropTypes.any,
    taskId: PropTypes.string
  };

  state = {
    solution: {
      path: "",
      activity: ""
    }
  };

  onChange = name => e =>
    this.setState({
      solution: { ...this.state.solution, [name]: e.target.value }
    });

  render() {
    const { onClose, onCommit, open, pathsInfo: pInfo, solution, taskId } = this.props;
    const stateSolution = this.state.solution;
    const pathsInfo = pInfo || [];
    const pathActivities =
      (pathsInfo).find(path => path.id === stateSolution.path) || {};
    const activities = pathActivities.activities || [];

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Creator Solution</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Path"
            onChange={this.onChange("path")}
            select
            style={styles.minWidthEditor}
            value={stateSolution.path || (solution && solution.path) || ""}
          >
            {pathsInfo
              .filter(
                pathInfo => pathInfo.activities && pathInfo.activities.length
              )
              .map(pathInfo => (
                <MenuItem key={pathInfo.id} value={pathInfo.id}>
                  {pathInfo.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            fullWidth
            label="Activity"
            onChange={this.onChange("activity")}
            select
            value={
              stateSolution.activity || (solution && solution.activity) || ""
            }
          >
            {activities.map(activity => (
              <MenuItem key={activity.id} value={activity.id}>
                {activity.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!(stateSolution.path && stateSolution.activity)}
            onClick={() => onCommit(stateSolution, taskId)}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCreatorSolutionDialog;
