/**
 * @file ConfirmationDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.02.18
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

class ConfirmationDialog extends React.PureComponent {
  static propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    resolve: PropTypes.func.isRequired
  };

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>{this.props.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => this.props.resolve(false)}>
            Cancel
          </Button>
          <Button
            raised
            color="primary"
            onClick={() => this.props.resolve(true)}
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
