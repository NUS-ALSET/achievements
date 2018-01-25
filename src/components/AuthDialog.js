/**
 * @file AuthDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 25.01.18
 */

import React from "react";
import PropTypes from "prop-types";
import Dialog, {
  DialogContent,
  DialogTitle
} from "material-ui/Dialog";
import Button from "material-ui/Button";
import withStyles from "material-ui/styles/withStyles";
import GoogleIcon from "mdi-react/GoogleIcon";
import GitHubIcon from "mdi-react/GithubCircleIcon";
import MailIcon from "material-ui-icons/Mail";

const styles = theme => ({
  authButton: {
    margin: theme.spacing.unit
  }
});

class AuthDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    authClick: PropTypes.func.isRequired
  };

  render() {
    const { classes, authClick } = this.props;
    return (
      <Dialog open={true}>
        <DialogTitle>Authorize</DialogTitle>
        <DialogContent>
          <Button
            fab
            className={classes.authButton}
            onClick={() => authClick("google")}
          >
            <GoogleIcon />
          </Button>
          <Button
            fab
            className={classes.authButton}
            onClick={() => authClick("mail")}
            disabled={true}
          >
            <MailIcon />
          </Button>
          <Button
            fab
            className={classes.authButton}
            onClick={() => authClick("github")}
            disabled={true}
          >
            <GitHubIcon />
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AuthDialog);
