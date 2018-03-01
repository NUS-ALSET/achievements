/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import TextField from "material-ui/TextField/TextField";

import {
  pathChangeRequest,
  pathDialogHide
} from "../../containers/Paths/actions";

class PathDialog extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    path: PropTypes.object
  };

  state = {
    name: ""
  };

  catchReturn = event => event.key === "Enter" && this.onCommit();
  onFieldChange = (field, value) => this.setState({ [field]: value });
  onClose = () => this.props.dispatch(pathDialogHide());
  onCommit = () => this.props.dispatch(pathChangeRequest(this.state));

  render() {
    const { path, open } = this.props;
    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {path && path.id ? "Edit Path" : "Add New Path"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={path && path.name}
            fullWidth
            label="Path name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            onKeyPress={this.catchReturn}
            required
          />
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

export default PathDialog;
