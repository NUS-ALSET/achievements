/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

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

  removeEmpty = value =>
    Object.assign(
      {},
      ...Object.keys(value || {})
        .filter(key => value[key])
        .map(key => ({ [key]: value[key] }))
    );
  catchReturn = event => event.key === "Enter" && this.onCommit();
  onFieldChange = (field, value) => this.setState({ [field]: value });
  onClose = () => {
    this.setState({ name: "" });
    this.props.dispatch(pathDialogHide());
  };
  onCommit = () => {
    this.props.dispatch(
      pathChangeRequest(
        Object.assign(this.props.path || {}, this.removeEmpty(this.state))
      )
    );
    this.setState({ name: "" });
  };

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
