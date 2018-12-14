/**
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

class RemoveExternalProfileDialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    externalProfileRemoveDialogHide: PropTypes.func,
    externalProfileRemoveRequest: PropTypes.func,
    externalProfileId: PropTypes.string,
    externalProfileType: PropTypes.string
  };

  onClose = () => this.props.externalProfileRemoveDialogHide();

  onCommit = () => {
    const { externalProfileRemoveRequest, externalProfileType } = this.props;

    externalProfileRemoveRequest(externalProfileType);
    this.onClose();
  };

  render() {
    const { open, externalProfileId, externalProfileType } = this.props;
    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            {"This action will disconnect your " +
              `${externalProfileType} profile "${externalProfileId}"` +
              ". Are you sure?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="secondary" onClick={this.onCommit} variant="contained">
            Disconnect
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveExternalProfileDialog;
