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

import {
  pathChangeRequest,
  pathDialogHide
} from "../../containers/Paths/actions";

// RegExp rules
import {
  AddName,
  NoStartWhiteSpace
} from "../regexp-rules/RegExpRules";


// this component is when click "Add Path" or "Edit Path"
class AddPathDialog extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    path: PropTypes.object
  };

  state = {
    name: "",
    // validate inputs
    isCorrectInput: false,
  };

  removeEmpty = value =>
    Object.assign(
      {},
      ...Object.keys(value || {})
        .filter(key => value[key])
        .map(key => ({ [key]: value[key] }))
    );

  // validate Path name input first
  onFieldChange = (field, value) => {
    if (
      AddName.test(value) &&
      NoStartWhiteSpace.test(value)
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

  resetState = () => {
    this.setState({
      name: "",
      isCorrectInput: false
    });
  };

  onClose = () => {
    this.resetState();
    this.props.dispatch(pathDialogHide());
  };

  onCommit = () => {
    this.props.dispatch(
      pathChangeRequest(
        Object.assign(this.props.path || {}, this.removeEmpty(this.state))
      )
    );
    this.resetState();
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
              : "input should not be empty, too long or have invalid characters"}
            fullWidth
            label="Path name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            required
          />
          <TextField
            defaultValue={path && path.description}
            label="Description"
            margin="dense"
            onChange={e => this.onFieldChange("description", e.target.value)}
            style={{
              width: 320
            }}
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

export default AddPathDialog;
