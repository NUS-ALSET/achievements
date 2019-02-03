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
import { ACTIVITY_TYPES } from '../../services/paths'

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

  goToLadder=()=>{
    const { activity, onClose } = this.props;
    const url = `//codecombat.com/play/level/${activity.level}`;
    window.open(url, "_blank");
    onClose();   
  }

  goToLevel = () => {
    const { activity, onClose } = this.props;
    let url = "";
    switch(activity.type){
      case ACTIVITY_TYPES.codeCombat.id:{
        url = `//codecombat.com/play/level/${activity.level}`;
        break;
      }
      case ACTIVITY_TYPES.codeCombatNumber.id:{
        url = `//codecombat.com/play`;
        break;
      }
      case ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id:{
        url = `//codecombat.com/play/level/${activity.level}?team=${activity.team}`;
        break;
      }
      default: {
        url = "//codecombat.com/play";;
      }
    }
    window.open(url, "_blank");
    onClose();
  };

  render() {
    let { activity, onClose, open } = this.props;
    if(!activity){
      return "";
    }

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>{ACTIVITY_TYPES[activity.type].caption}</DialogTitle>
        <DialogContent>
        {
          activity.type===ACTIVITY_TYPES.codeCombat.id &&  <Typography>
          You have not completed {`"${activity.level}"`} level on CodeCombat.
          Would you like to go to CodeCombat to complete this level
          </Typography>
        }
        {
          activity.type===ACTIVITY_TYPES.codeCombatNumber.id &&  <Typography>
          You have not completed {`"${activity.count}"`} levels on CodeCombat.
          Would you like to go to CodeCombat to complete more levels.
          </Typography>
        }
        {
          activity.type===ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id &&  <Typography>
          You have not get {`"${activity.requiredPercentile}"`} percentile in {`"${activity.level}"`} level with {`"${activity.team}"`} team on CodeCombat.
          Would you like to go to CodeCombat to complete this level
          </Typography>
        }
         
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.goToLevel} variant="contained">
            Go to level
          </Button>
          {
          activity.type===ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id &&
          <Button color="primary" onClick={this.goToLadder} variant="contained">
            Go to ladder
          </Button>
          }
        </DialogActions>
      </Dialog>
    );
  }
}

export default FetchCodeCombatLevelDialog;
