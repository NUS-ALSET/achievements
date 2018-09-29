/**
 * @file Copied from AddProfileDialog container module
 */

import PropTypes from "prop-types";
import React, {Fragment} from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";

import CodeCombatLogin from "../../assets/CodeCombatLogin.png";

class FetchCodeCombatDialog extends React.PureComponent {
  static propTypes = {
    externalProfile: PropTypes.object.isRequired,
    defaultValue: PropTypes.string,
    currentUserId: PropTypes.string,
    inProgress: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  state = {};

  onGotoLink = () => {
    const { currentUserId, onClose } = this.props;
    window.open(`/#/profile/${currentUserId}`);
    onClose();
  };

  onCommit = () => {
    this.props.onCommit(this.state.login || this.props.defaultValue);
    this.props.onClose();
  };

  render() {
    const { externalProfile, defaultValue, inProgress, onClose } = this.props;
    const login =
      this.state.login === undefined ? defaultValue || "" : this.state.login;
    const url = `${externalProfile.url}/user/${login}`;

    return (
      <Dialog onClose={onClose} open={this.props.open}>
        {login
          ? (
            <Fragment>
              <DialogTitle>Fetch {externalProfile.name} Profile</DialogTitle>
              <DialogContent>
                <Typography variant="body2" gutterBottom>
                  1. Confirm Your CodeCombat Profile
                </Typography>
                <Typography variant="subheading" gutterBottom>
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  2. Make sure you are logged in to CodeCombat
                </Typography>
                <img
                  src={CodeCombatLogin}
                  alt="CodeCombatLogin"
                  style={{maxHeight: 110}}
                  align="center"
                />
                <Typography variant="body2" gutterBottom>
                  3. Click Fetch
                </Typography>
              </DialogContent>
            </Fragment>
          )
          :(
            <Fragment>
              <DialogTitle>{externalProfile.name} Profile Not Set Up</DialogTitle>
              <DialogContent>
                <Typography variant="body2" gutterBottom>
                  Click "SET UP PROFILE" to add your CodeCombat profile
                </Typography>
                <Typography variant="caption" gutterBottom>
                  Set up the profile at our Profile page
                </Typography>
              </DialogContent>
            </Fragment>
          )
        }
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={this.onGotoLink}
            variant="outlined"
            color="primary"
          >
            Set Up Profile
          </Button>
          {login &&
            <Button
              color="primary"
              disabled={inProgress}
              onClick={this.onCommit}
              variant="raised"
            >
              Fetch
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
          }
        </DialogActions>
      </Dialog>
    );
  }
}

export default FetchCodeCombatDialog;