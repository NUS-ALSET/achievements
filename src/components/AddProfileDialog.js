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

const STRING_MAX = 32;

class AddProfileDialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    externalProfile: PropTypes.object.isRequired,
    onCommit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
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

  render() {
    const url = `${this.props.externalProfile.url}/user/${this.state.login}`;
    const { externalProfile, onCommit, onCancel } = this.props;

    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Add Profile</DialogTitle>
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
              this.clearState();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onCommit(this.state.login, externalProfile);
              this.clearState();
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
