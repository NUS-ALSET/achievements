/**
 * @file SignInDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.10.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

class SignInDialog extends React.PureComponent {
  static propTypes = {
    onSignInClick: PropTypes.func,
    open: PropTypes.bool.isRequired
  };

  render() {
    const { onSignInClick, open } = this.props;
    return (
      <Dialog open={open}>
        <DialogTitle>Sign in Request</DialogTitle>
        <DialogContent>
          <Typography>
            To save your work on this activity, please log in
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onSignInClick} variant="contained">
            Sign in
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default SignInDialog;
