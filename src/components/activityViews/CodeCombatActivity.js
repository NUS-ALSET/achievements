/**
 * @created 02.08.18
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";


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

  render() {
    const {
      problem,
      userAchievements,
    } = this.props;
    const achievements = ((userAchievements || {}).CodeCombat || {}).achievements;
    if(!achievements){
      return (
        <Typography>
            Please add your Codecombat profile to complete this assigment.  
        </Typography>
      )
      
    }
    if(problem.type==="codeCombat"){
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
                You have not completed {`"${problem.level}"`} level on CodeCombat.
                Would you like to go to CodeCombat to complete this level
              </Typography>
              <br/>
              <Button color="primary" variant="contained">
                <a href={levelURL} target="__blank" style={{color : 'white'}}> Go To Level</a>
                </Button>
            </div>
      );
    }else if(problem.type==="codeCombatNumber"){
      const hasNumOfLevelCompleted = achievements.totalAchievements >=  problem.count;
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
              This assigment required to complete {problem.count} levels,
              but you have only compledted levels;
                You have completed only {achievements.totalAchievements || 0} {achievements.totalAchievements > 0 ? 'levels' : 'level'} on CodeCombat.
              </Typography>
              <Typography>
                Would you like to go to CodeCombat.
              </Typography>
              <br/>
              <Button color="primary"variant="contained">
                <a href={externalProfile.url} target="__blank" style={{color : 'white'}}> Go To Codecombat</a>
                </Button>
            </div>
      );
    }else{
      return (
        <div>
          Wrong Activity Type.
        </div>
      )
    }


  }
}

export default CodeCombatActivity;