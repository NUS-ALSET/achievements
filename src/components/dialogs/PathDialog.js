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
    name: "",
    // detect if text input is only printable characters
    // and does not start or only have spaces
    // if so CorrentInput
    isCorrectInput: true,
  };

  removeEmpty = value =>
    Object.assign(
      {},
      ...Object.keys(value || {})
        .filter(key => value[key])
        .map(key => ({ [key]: value[key] }))
    );

  catchReturn = event => event.key === "Enter" && this.onCommit();

  // validate Path name input first
  onFieldChange = (field, value) => {
    /* eslint-disable no-useless-escape */
    if (/^[^\s][a-zA-Z0-9\t\n ./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]*$/
      .test(value)
    ) {
      this.setState({
        isCorrectInput: true,
        [field]: value.trim()
      });
    } else {
      this.setState({
        isCorrectInput: false
      });
    }
  };

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
            error={!this.state.isCorrectInput}
            defaultValue={path && path.name}
            helperText={this.state.isCorrectInput
              ? ""
              : "input should not be empty or have invalid characters"}
            fullWidth
            label="Path name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            onKeyPress={this.catchReturn}
            style={{
              width: 320
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            disabled={!this.state.isCorrectInput}
            color="primary"
            onClick={this.onCommit}
            variant="raised"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default PathDialog;
