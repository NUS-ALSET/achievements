/**
 * @file AddProfileDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 29.01.18
 */

import CircularProgress from "@material-ui/core/CircularProgress";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React, { Fragment } from "react";

import TextField from "@material-ui/core/TextField";
import { AccountService } from "../../services/account";
import { Typography } from "@material-ui/core";

import CodeCombatLogin from "../../assets/CodeCombatLogin.png";

class AddProfileDialog extends React.PureComponent {
  static propTypes = {
    externalProfile: PropTypes.object.isRequired,
    defaultValue: PropTypes.string,
    keepOnCommit: PropTypes.bool,
    inProgress: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  state = {};

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
    this.onCommit();
  };
  onCommit = () => {
    this.props.onCommit((this.state.login || this.props.defaultValue), this.props.externalProfile.id);
    if (!this.props.keepOnCommit) {
      this.props.onClose();
    }
  };

  render() {
    const { externalProfile, defaultValue, inProgress, onClose } = this.props;
    const login =
      this.state.login === undefined ? defaultValue || "" : this.state.login;
    const url = `${externalProfile.url}/user/${login}`;

    return (
      <Dialog onClose={onClose} open={this.props.open}>
        <DialogTitle>Set Up {externalProfile.name} Profile</DialogTitle>
        <DialogContent>
          <Typography gutterBottom variant="body1">
            1. Register or Login with {externalProfile.url}
          </Typography>
          { externalProfile.id === 'CodeCombat' &&
            <Fragment>
              <img
                align="center"
                alt="CodeCombatLogin"
                src={CodeCombatLogin}
                style={{ maxHeight: 110 }}
              />
            <Typography gutterBottom variant="subtitle1">
            <a
              href="https://codecombat.com/home"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://codecombat.com/home
            </a>
            </Typography>
            </Fragment>
          }
          <Typography gutterBottom variant="body1">
            2. Enter your CodeCombat username:
          </Typography>
          <TextField
            autoFocus
            helperText="we only need the URL after /user/"
            label="Profile Name"
            margin="dense"
            onChange={this.onProfileChange}
            onKeyPress={this.catchReturn}
            placeholder="e.g. dummyuser3"
            style={{
              width: 560
            }}
            value={login}
          />
          <Typography gutterBottom variant="subtitle1">
            <a href={url} rel="noopener noreferrer" target="_blank">
              {url}
            </a>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={inProgress}
            onClick={this.onCommit}
            variant="contained"
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
