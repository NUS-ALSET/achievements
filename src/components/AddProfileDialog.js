/**
 * @file AddProfileDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 29.01.18
 */

import React from "react";
import PropTypes from "prop-types";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { accountService } from "../services/account";

const STRING_MAX = 32;

class AddProfileDialog extends React.PureComponent {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    externalProfile: PropTypes.object.isRequired,
    onError: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func,
    defaultValue: PropTypes.string
  };

  state = {
    login: ""
  };

  clearState = () => {
    this.setState({
      login: ""
    });
  };

  onProfileChange = e => {
    this.setState({
      login: e.target.value.toLowerCase().slice(0, STRING_MAX)
    });
  };

  onCommitClick = () => {
    const { externalProfile, uid, onError, onCommit } = this.props;
    const { login } = this.state;

    return Promise.resolve()
      .then(() =>
        accountService.addExternalProfile(externalProfile, uid, login)
      )
      .then(() => onCommit && onCommit())
      .catch(err => {
        onError(err.message);
      });
  };

  render() {
    const { externalProfile, onClose } = this.props;
    const url = `${externalProfile.url}/user/${this.state.login}`;

    return (
      <Dialog open={this.props.open}>
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
            value={this.state.login}
            autoFocus
            label="Profile"
            onChange={this.onProfileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              this.props.onClose();
              this.clearState();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            raised
            onClick={() => {
              this.onCommitClick().then(() => {
                onClose();
                this.clearState();
              });
            }}
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddProfileDialog;
