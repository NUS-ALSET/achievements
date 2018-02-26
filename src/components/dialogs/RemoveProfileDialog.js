/**
 * @file DeleteCourseDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.02.18
 */

import {
  externalProfileRemoveDialogHide,
  externalProfileRemoveRequest
} from "../../containers/Account/actions";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import PropTypes from "prop-types";
import React from "react";
import Typography from "material-ui/Typography";

class RemoveExternalProfileDialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    externalProfileId: PropTypes.string,
    externalProfileType: PropTypes.string
  };

  onClose = () => this.props.dispatch(externalProfileRemoveDialogHide());

  onCommit = () => {
    const { dispatch, externalProfileType } = this.props;

    dispatch(externalProfileRemoveRequest(externalProfileType));
    this.onClose();
  };

  render() {
    const { open, externalProfileId, externalProfileType } = this.props;
    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            {"This action will delete the " +
              `${externalProfileType} profile "${externalProfileId}"` +
              ". Are you sure?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="secondary" onClick={this.onCommit} variant="raised">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveExternalProfileDialog;
