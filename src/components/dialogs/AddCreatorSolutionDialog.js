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

class AddCreatorSolutionDialog extends React.PureComponent {
  static propTypes = {
    pathsData: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    solution: PropTypes.any,
    taskId: PropTypes.string
  };

  state = {
    path: "",
    solution: ""
  };

  onChange = name => e => this.setState({ [name]: e.target.value });

  render() {
    const { onClose, onCommit, open, pathsData, solution, taskId } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Creator Solution</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={(solution && solution.path) || ""}
            fullWidth
            label="Path"
            onChange={this.onChange("path")}
            select
            style={{
              width: 320
            }}
          >
            {pathsData.paths.map(pathInfo => (
              <MenuItem key={pathInfo.id} value={pathInfo.id}>{pathInfo.caption}</MenuItem>
            ))}
          </TextField>
          <TextField
            defaultValue={(solution && solution.activity) || ""}
            fullWidth
            label="Activity"
            onChange={this.onChange("activity")}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!this.state.isCorrectInput}
            onClick={() => {
              onCommit((this.state.solution || "").trim(), taskId);
              this.setState({
                isCorrectInput: false
              });
            }}
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
