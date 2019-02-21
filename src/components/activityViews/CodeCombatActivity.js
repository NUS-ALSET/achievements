/**
 * @created 02.08.18
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ACTIVITY_TYPES, CodeCombat_Multiplayer_Data } from "../../services/paths";
import { externalProfileRefreshRequest } from "../../containers/Account/actions";


const externalProfile = {
  url: "https://codecombat.com",
  id: "CodeCombat"
};

class CodeCombatActivity extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    problem: PropTypes.object,
    userAchievements: PropTypes.object,
    readOnly: PropTypes.bool
  };
  updateCodeCombatProfile = ()=>{
    const { dispatch, userAchievements } = this.props;
    const codeCombatProfileId = userAchievements.CodeCombat.id;
      dispatch(
        externalProfileRefreshRequest(
          codeCombatProfileId,
          "CodeCombat"
        )
      )
  }
  render() {
    const {
      problem,
      userAchievements
    } = this.props;

    const codeCombatAchievements = ((userAchievements || {}).CodeCombat || {});
    const achievements = codeCombatAchievements.achievements;
    
    if (!achievements){
      return (
        <Typography>
            Please add your Codecombat profile to complete this assigment.  
        </Typography>
      )
    }
    const updateCodeCombatAchievements = (<Button color="primary" onClick={this.updateCodeCombatProfile} style={{marginLeft : "10px"}}  variant="contained">
      Update CodeCombat Profile
    </Button>)
    if (problem.type===ACTIVITY_TYPES.codeCombat.id){
      const hasLevelCompleted = (achievements[problem.level] || {}).complete;
      if (hasLevelCompleted) {
        this.props.onCommit({
          type: "SOLUTION",
          solution: {
            value: this.props.userAchievements.CodeCombat.id
          }
        });
      }
      const levelURL = `https://codecombat.com/play/level/${(problem || {}).level}`
      if (hasLevelCompleted) {
        return <div> Completed </div>
      }
      return (
        <div>
          <Typography>
            Assignmnet Type: {ACTIVITY_TYPES.codeCombat.caption}
          </Typography>
          <Typography>
            Level to complete: {problem.level}
          </Typography>
            <Typography>
                You have not completed {`"${problem.level}"`} level on CodeCombat.
                Would you like to go to CodeCombat to complete this level
              </Typography>
              <br/>
              <Button color="primary" variant="contained">
                <a href={levelURL} style={{color : "white"}} target="__blank" > Go To Level</a>
              </Button>
              { updateCodeCombatAchievements }
            </div>
      );
    } else if (problem.type===ACTIVITY_TYPES.codeCombatNumber.id) {
      const totalAchievements = (userAchievements.CodeCombat || {}).totalAchievements || 0;
      const hasNumOfLevelCompleted = totalAchievements >=  problem.count;
      if (hasNumOfLevelCompleted) {
        this.props.onCommit({
          type: "SOLUTION",
          solution: {
            value: this.props.userAchievements.CodeCombat.id
          }
        });
      }
      if (hasNumOfLevelCompleted) {
        return <div> Completed </div>
      }
      return (
        <div>
           <Typography>
            Assignmnet Type: {ACTIVITY_TYPES.codeCombatNumber.caption}
          </Typography>
          <Typography>
            Number of levels to complete: {problem.count}
          </Typography>
            <Typography>
              This assigment required to complete {problem.count} levels,
              but you have only compledted levels;
                You have completed only {totalAchievements || 0} {totalAchievements > 0 ? "levels" : "level"} on CodeCombat.
              </Typography>
              <Typography>
                Would you like to go to CodeCombat.
              </Typography>
              <br/>
              <Button color="primary"variant="contained">
                <a
                  href={externalProfile.url}
                  style={{ color : "white" }}
                  target="__blank">
                  Go To Codecombat
                </a>
              </Button>
              { updateCodeCombatAchievements }
            </div>
      );
    } else if (problem.type===ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id){
      const levelUrl = `//codecombat.com/play/level/${problem.level}?team=${problem.team}`;
      const ladderUrl = `//codecombat.com/play/ladder/${problem.level}`;
      const userPercentile = codeCombatAchievements.ladders ? (codeCombatAchievements.ladders[`${problem.level}-${problem.team}`] || {}).percentile : null;
      const hasNumOfLevelCompleted = userPercentile >=problem.requiredPercentile;
      const ladderKey = `${problem.level}-${problem.team}`;
      const ladder = (codeCombatAchievements.ladders || {})[ladderKey] || {};
      const ranked = ladder.isRanked ? ladder.rank : 0;
      const teamColor = CodeCombat_Multiplayer_Data.teams[problem.team].name;
      const level = CodeCombat_Multiplayer_Data.levels[problem.level].name;
      const numInRanking = ladder.numInRanking || 0;

      if (hasNumOfLevelCompleted) {
        this.props.onCommit({
          type: "SOLUTION",
          solution: {
            value: userPercentile
          }
        });
      }
      if (hasNumOfLevelCompleted) {
        return <div> Completed </div>
      }
      return (
        <div>
          <Typography>
            Assignmnet Type: {ACTIVITY_TYPES.codeCombatMultiPlayerLevel.caption}
          </Typography>
          <Typography>
            Level: {problem.level}
          </Typography>
          <Typography>
            Team: {problem.team}
          </Typography>
            <Typography>
              {
                Object.keys(ladder).length > 0
                ? `You are ranked ${ranked} out of ${numInRanking} (${ladder.percentile} percentile) playing as ${teamColor} on the ${level} multiplayer level. You have to be better than ${problem.requiredPercentile} percent of the other players to complete this activity.`
                : `You have not played "${level}" level as "${teamColor}" team.`
              }
              </Typography>
              <br/>
              <Button color="primary"variant="contained">
                <a href={ladderUrl} style={{color : "white"}} target="__blank" > Go To Ladder</a>
              </Button>
              <Button color="primary" style={{marginLeft : "10px"}} variant="contained" >
                <a href={levelUrl} style={{color : "white"}} target="__blank" > Go To Level</a>
              </Button>
                { updateCodeCombatAchievements }
            </div>
      );
    } else {
      return (
        <div>
          Wrong Activity Type.
        </div>
      )
    }


  }
}

export default CodeCombatActivity;