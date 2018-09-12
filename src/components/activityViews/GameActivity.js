/**
 * @created 11.09.18
 */

import React from "react";
import PropTypes from "prop-types";


// import PassengerPickerGame from 'alset-passengerpicker-game/passengerPickup/src/game'
// import Squad from 'alset-squad-game/squadGame/src/game'

import PassengerPickerGame from '../games/passenger-picker'
import Squad from '../games/squad'

const games = {
  'passenger-picker' : PassengerPickerGame,
  'squad' : Squad
}

class GameActivity extends React.PureComponent {
  static propTypes = {
    onCommit: PropTypes.func.isRequired,
    problem: PropTypes.object,
    solution: PropTypes.object,
    readOnly : PropTypes.bool
  };

  handleSubmit = solution =>{
    
    if(this.props.onChange){
        this.props.onCommit({ type : 'SOLUTION', solution });
    }else{
        this.props.onCommit(solution, this.props.taskId);
    }
  }
  render() {
    const { problem, solution, readOnly ,onCommit,taskId} = this.props;
    if(!problem){
      return '';
    }
    const SpecificGame = games[problem.game];
    return (
      <SpecificGame
        player1Data={{
          levelsToWin: `level${problem.levelsToWin}`,
          playMode : problem.playMode
        }}
        scoreToWin={Number(problem.scoreToWin)}
        time={problem.gameTime}
        onCommit={this.handleSubmit}
      />
    );
  }
}

export default GameActivity;
