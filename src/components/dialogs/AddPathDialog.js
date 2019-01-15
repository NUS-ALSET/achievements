/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 * @renamed AddPathDialog 28.08.18 (kyy)
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";

// this component is when click "Add Path" or "Edit Path"
class AddPathDialog extends React.PureComponent {
  static propTypes = {
    pathChangeRequest: PropTypes.func,
    pathDialogHide: PropTypes.func,
    open: PropTypes.bool.isRequired,
    path: PropTypes.object
  };

  state = {
    name: "",
    // validate inputs
    isCorrectInput: false
  };

  removeEmpty = value =>
    Object.assign(
      {},
      ...Object.keys(value || {})
        .filter(key => value[key])
        .map(key => ({ [key]: value[key] }))
    );

  // validate Path name
  onFieldChange = (field, value) => {
    const { path } = this.props;
    if (path && path.id) {
      this.setState({
        isCorrectInput: true
      });
    }
    if (field === "name") {
      if (AddName.test(value) && NoStartWhiteSpace.test(value)) {
        this.setState({
          isCorrectInput: true,
          [field]: value.trim()
        });
      } else {
        this.setState({
          isCorrectInput: false
        });
      }
    } else {
      this.setState({ [field]: value.trim() });
    }
  };

  resetState = () => {
    this.setState({
      name: "",
      isCorrectInput: false
    });
  };

  onClose = () => {
    this.resetState();
    this.props.pathDialogHide();
  };

  onCommit = () => {
    this.props.pathChangeRequest(
      Object.assign(this.props.path || {}, this.removeEmpty(this.state))
    );
    this.resetState();
  };

  render() {
    const { path, open } = this.props;
    return (
      <Dialog fullWidth maxWidth={"sm"} onClose={this.onClose} open={open}>
        <DialogTitle>
          {path && path.id ? "Edit Path" : "Add New Path"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={path && path.name}
            error={!this.state.isCorrectInput}
            fullWidth
            helperText={
              this.state.isCorrectInput
                ? ""
                // eslint-disable-next-line max-len
                : "input should not be empty, too long or have invalid characters"
            }
            label="Path name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            required
          />
          <TextField
            defaultValue={path && path.description}
            fullWidth
            label="Description"
            margin="dense"
            onChange={e => this.onFieldChange("description", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!this.state.isCorrectInput}
            onClick={this.onCommit}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddPathDialog;
