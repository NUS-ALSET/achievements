/**
 * @file RefreshPageDialog component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 20.10.18
 */

import PropTypes from "prop-types";
import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

class RefreshPageDialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired
  };

  onAcceptClick = () => window.location.reload(true);

  render() {
    const { open } = this.props;
    return (
      <Dialog open={open}>
        <DialogTitle>Refresh Request</DialogTitle>
        <DialogContent>
          <Typography>
            New version of this page was deployed. Refresh page, please
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={this.onAcceptClick}
            variant="contained"
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RefreshPageDialog;
