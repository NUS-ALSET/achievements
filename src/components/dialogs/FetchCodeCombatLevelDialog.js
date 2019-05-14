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
// eslint-disable-next-line max-len
import { ACTIVITY_TYPES, CodeCombat_Multiplayer_Data } from "../../services/paths";

class FetchCodeCombatLevelDialog extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    userAchievements: PropTypes.object
  };

  static defaultProps = {
    open: false
  };

  state = {
    openedLevel: false
  };

  goToLadder=()=>{
    const { activity, onClose } = this.props;
    const url = `//codecombat.com/play/ladder/${activity.level}`;
    window.open(url, "_blank");
    onClose();   
  }

  goToLevel = () => {
    const { activity, onClose } = this.props;
    let url = "";
    switch (activity.type){
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
    let { activity, onClose, open, userAchievements } = this.props;
    if (!activity){
      return "";
    }
    const service = activity.service || "CodeCombat";
    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>{ACTIVITY_TYPES[activity.type].caption}</DialogTitle>
        <DialogContent>
        {
          activity.type===ACTIVITY_TYPES.codeCombat.id &&  <Typography>
          You have not completed {`"${activity.level}"`} level on {service}.
          Would you like to go to {service} to complete this level
          </Typography>
        }
        {
          activity.type===ACTIVITY_TYPES.codeCombatNumber.id &&  <Typography>
          You have not completed {`"${activity.count}"`} levels on {service}.
          Would you like to go to {service} to complete more levels.
          </Typography>
        }
        {
          activity.type===ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id && (() => {
            const codeCombatAchievements = userAchievements[service] || {};
            const ladderKey = `${activity.level}-${activity.team}`;
            const ladder = (codeCombatAchievements.ladders || {})[ladderKey] || {};
            const ranked = ladder.isRanked ? ladder.rank : 0;
            const teamColor = CodeCombat_Multiplayer_Data.teams[activity.team].name;
            const level = CodeCombat_Multiplayer_Data.levels[activity.level].name;
            const numInRanking = ladder.numInRanking || 0;
            return (
              <Typography>
                {
                  Object.keys(ladder).length > 0
                  ? `You are ranked ${ranked} out of ${numInRanking} (${ladder.percentile} percentile) playing as ${teamColor} on the ${level} multiplayer level. You have to be better than ${activity.requiredPercentile} percent of the other players to complete this activity.`
                  : `You have not played "${level}" level as "${teamColor}" team.`
                }
              </Typography>
            );
          })()
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
