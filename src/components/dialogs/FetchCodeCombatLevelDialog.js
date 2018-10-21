/**
 * @file FetchCodeCombatLevelDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.10.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { APP_SETTING } from "../../achievementsApp/config";

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
    window.addEventListener("focus", () => console.error("test"), {
      once: true
    });
    window.open(
      `//codecombat.com/play/level/${this.props.activity.level}`,
      "_blank"
    );
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
          {APP_SETTING.isSuggesting && (
            <Fragment>
              <div
                style={{
                  position: "relative",
                  height: 90,
                  width: "100%",
                  overflow: "hidden"
                }}
              >
                <iframe
                  height={200}
                  scrolling="no"
                  seamless={true}
                  src="https://codecombat.com/students"
                  style={{
                    position: "absolute",
                    left: -230,
                    top: -110,
                    width: 1024,
                    height: 768
                  }}
                  title={"test"}
                  width={640}
                />
              </div>
              <Typography>Make sure that there is your hero above</Typography>
            </Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.goToLevel} variant="raised">
            Go to level
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FetchCodeCombatLevelDialog;
