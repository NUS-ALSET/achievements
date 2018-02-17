/**
 * @file DeleteCourseDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.02.18
 */

import React from "react";
import PropTypes from "prop-types";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import {
  externalProfileRemoveDialogHide,
  externalProfileRemoveRequest
} from "../containers/Account/actions";

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
      <Dialog open={open} onClose={this.onClose}>
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
          <Button raised color="secondary" onClick={this.onCommit}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveExternalProfileDialog;
