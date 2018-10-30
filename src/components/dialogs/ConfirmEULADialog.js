/* eslint-disable react/no-unescaped-entities */
/**
 * @file ConfirmEULADialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.02.18
 */

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";

class ConfirmEULADialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onSignOut: PropTypes.func.isRequired,
    onAcceptEULA: PropTypes.func.isRequired
  };

  render() {
    const { open, onSignOut, onAcceptEULA } = this.props;
    return (
      <Dialog open={open}>
        <DialogTitle>License Agreement</DialogTitle>
        <DialogContent>
          <Typography>
            This application collects data which is used to improve the
            application experience for future users. By accepting this terms of
            service, you acknowledge that data such as what you've clicked on
            and when you've clicked on it will be made available to NUS students
            and faculty who will analyze this data to attempt to improve the
            experience for other users
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onSignOut}>
            Sign out
          </Button>
          <Button color="primary" onClick={onAcceptEULA} variant="contained">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmEULADialog;
