/**
 * @file AuthRequireBanner container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.10.18
 */

import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = () => ({
  mainBanner: {
    position: "absolute",
    top: 64,
    left: 0,
    right: 0,
    zIndex: 9999,
    padding: "0 25px"
  },
  textMessage: { display: "inline-block", marginTop: 7 },
  button: { float: "right" }
});

class AuthRequireBanner extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    open: PropTypes.bool,
    message: PropTypes.string
  };

  render() {
    const { classes, open, message } = this.props;
    if (!open) {
      return null;
    }
    return (
      <Paper className={classes.mainBanner}>
        <Typography className={classes.textMessage}>
          {message || "To save your work on this activity, please log in"}
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(AuthRequireBanner);
