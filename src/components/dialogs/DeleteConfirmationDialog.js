/**
 * @file DeleteConfirmationDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

class DeleteConfirmationDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
  };

  render() {
    const { onClose, onCommit, open, message } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={onCommit} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

// noinspection JSUnusedGlobalSymbols
export default DeleteConfirmationDialog;
