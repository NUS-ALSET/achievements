/**
 * @file RequestMorePathContentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.10.18
 */

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";

class RequestMorePathContentDialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  onConfirm = () => {
    this.props.onConfirm();
    this.props.onClose();
  };

  render() {
    const { open, onClose } = this.props;
    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Request for additional path content</DialogTitle>
        <DialogContent>
          <Typography>
            Thanks for you completing this path. Would you like to request more
            content on this path?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onConfirm} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RequestMorePathContentDialog;
