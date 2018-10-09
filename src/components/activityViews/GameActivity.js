/**
 * @created 11.09.18
 */

import React from "react";
import PropTypes from "prop-types";


const Loading = () => {
  return <div style={{ width : '100%', marginTop :'45vh', textAlign : 'center'}}>Loading...</div>;
}

const Game404 = () => {
  return 'Game not exist'
}

class GameActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.selectGame(props);
    this.state = {
      specificGame: null
    }
  }
  componentWillReceiveProps(nextProps) {
    this.selectGame(nextProps);
  }
  static propTypes = {
    onCommit: PropTypes.func.isRequired,
    problem: PropTypes.object,
    solution: PropTypes.object,
    readOnly: PropTypes.bool
  };

  handleSubmit = solution => {
    
    if (this.props.onChange) {
      this.props.onCommit({ type: 'SOLUTION', solution });
    } else {
      this.props.onCommit(solution, this.props.taskId);
    }
  }
  selectGame = (props) => {
    const { problem = {} } = props;
    switch (problem.game) {
      case 'passenger-picker': {
        import('../games/passenger-picker/src/component')
          .then(({ Game }) => {
            this.setState({ specificGame: Game })
          })
        break;
      }
      case 'squad': {
        import('../games/squad')
          .then(({ Game }) => {
            this.setState({ specificGame: Game })
          })
        break;
      }
      default: {
        this.setState({ specificGame: Game404 })
      }
    }
  }
  render() {
    const { problem
      // solution, readOnly, onCommit, taskId 
    } = this.props;
    if (!problem) {
      return '';
    }
    const SpecificGame = this.state.specificGame || Loading;
    return (
      <SpecificGame
        player1Data={{
          pyCode: '', 
          jsCode: ''
        }}
        gameData={{
          playMode: problem.playMode,
          // levelsToWin: problem.levelsToWin,
          scoreToWin: Number(problem.scoreToWin),
          gameTime: problem.gameTime,
          botsQuantities: problem.unitsPerSide,
          gameType: problem.type.toUpperCase(),
        }}
        onCommit={this.handleSubmit}
      />
    );
  }
}

export default GameActivity;
