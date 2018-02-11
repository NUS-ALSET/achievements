/**
 * @file NotificationArea container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 25.01.18
 */

import React from "react";
import PropTypes from "prop-types";
import Snackbar from "material-ui/Snackbar";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";

class NotificationArea extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired
  };

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={this.props.open}
        SnackbarContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span>{this.props.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.props.handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

export default NotificationArea;
