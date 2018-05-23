/**
 * @file AddProfileDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 29.01.18
 */

import CircularProgress from "@material-ui/core/CircularProgress";
import {
  externalProfileDialogHide,
  externalProfileUpdateRequest
} from "../../containers/Account/actions";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";

import TextField from "@material-ui/core/TextField";
import { AccountService } from "../../services/account";

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
    const { externalProfile } = this.props;

    this.setState({
      login: AccountService.processProfile(externalProfile.id, e.target.value)
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
      <Dialog onClose={this.onClose} open={this.props.open}>
        <DialogTitle>Set {externalProfile.name} Profile</DialogTitle>
        <DialogContent>
          <div>
            <a href={url}>{url}</a>
          </div>
          <TextField
            autoFocus
            label="Profile"
            margin="dense"
            onChange={this.onProfileChange}
            onKeyPress={this.catchReturn}
            style={{
              width: 560
            }}
            value={this.state.login}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={inProgress}
            onClick={this.onCommitClick}
            variant="raised"
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
