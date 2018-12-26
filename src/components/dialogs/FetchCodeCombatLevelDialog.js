/**
 * @file FetchCodeCombatLevelDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.10.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

class FetchCodeCombatLevelDialog extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.any,
    codeCombatId: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };

  static defaultProps = {
    open: false
  };

  state = {
    openedLevel: false
  };

  goToLevel = () => {
    const { activity, onClose } = this.props;
    window.open(`//codecombat.com/play/level/${activity.level}`, "_blank");
    onClose();
  };

  render() {
    let { activity, onClose, open } = this.props;

    activity = activity || {};

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Fetch CodeCombat level</DialogTitle>
        <DialogContent>
          <Typography>
            You have not completed {`"${activity.level}"`} level on CodeCombat.
            Would you like to go to CodeCombat to complete this level
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.goToLevel} variant="contained">
            Go to level
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FetchCodeCombatLevelDialog;
