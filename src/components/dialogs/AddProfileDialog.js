/**
 * @file AddProfileDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 29.01.18
 */

import { CircularProgress } from "material-ui/Progress";
import {
  externalProfileDialogHide,
  externalProfileUpdateRequest
} from "../../containers/Account/actions";

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import PropTypes from "prop-types";
import React from "react";

import TextField from "material-ui/TextField";

const STRING_MAX = 32;

class AddProfileDialog extends React.PureComponent {
  static propTypes = {
    inProgress: PropTypes.any,
    open: PropTypes.bool.isRequired,
    externalProfile: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    onCommit: PropTypes.func,
    defaultValue: PropTypes.string
  };

  state = {
    login: ""
  };

  onProfileChange = e => {
    this.setState({
      login: e.target.value.toLowerCase().slice(0, STRING_MAX)
    });
  };

  catchReturn = event => {
    if (event.key !== "Enter") {
      return;
    }
    this.onCommitClick();
  };

  onCommitClick = () => {
    const { externalProfile, dispatch, onCommit } = this.props;
    const { login } = this.state;

    dispatch(externalProfileUpdateRequest(login, externalProfile.id));
    if (onCommit) {
      onCommit(login);
    }
  };

  onClose = () => this.props.dispatch(externalProfileDialogHide());

  render() {
    const { externalProfile, inProgress } = this.props;
    const url = `${externalProfile.url}/user/${this.state.login}`;

    return (
      <Dialog open={this.props.open} onClose={this.onClose}>
        <DialogTitle>Set {externalProfile.name} Profile</DialogTitle>
        <DialogContent>
          <div>
            <a href={url}>{url}</a>
          </div>
          <TextField
            margin="dense"
            style={{
              width: 560
            }}
            onKeyPress={this.catchReturn}
            value={this.state.login}
            autoFocus
            label="Profile"
            onChange={this.onProfileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            raised
            onClick={this.onCommitClick}
            disabled={inProgress}
          >
            Commit
            {inProgress && (
              <CircularProgress
                style={{
                  position: "absolute",
                  left: 36,
                  width: 20,
                  height: 20
                }}
              />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddProfileDialog;
