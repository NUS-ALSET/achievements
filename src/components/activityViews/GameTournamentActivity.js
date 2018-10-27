/**
 * @created 11.09.18
 */

import React from "react";
import PropTypes from "prop-types";
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root : {},
  verticalMiddle: {
    width: '100%', marginTop: '45vh', textAlign: 'center'
  }
};

const Loading = ({ className }) => {
  return <div className={className}>Loading...</div>;
}

const Game404 = ({ className }) => {
  return <div className={className}>Game not exist</div>;
}

class GameTournamentActivity extends React.PureComponent {
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
        import('../games/passenger-pickup/src/component')
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
    const { problem, botsQuantity, classes
      // solution, readOnly, onCommit, taskId 
    } = this.props;
    if (!problem) {
      return '';
    }
    const levelNumber={
      "1" : 1,
      "2" : 2,
      "3" : 3,
      "Easy" : 1,
      "Medium" : 2,
      "Hard" : 3
    }
    const SpecificGame = this.state.specificGame || Loading;
    return (
      <SpecificGame
        gameData={{
          playMode: problem.playMode,
          levelsToWin: levelNumber[problem.levelsToWin],
          scoreToWin: Number(problem.scoreToWin),
          gameTime: problem.gameTime,
          botsQuantities: problem.unitsPerSide,
          gameType: 'gameTournament'//problem.type,
        }}
        tournament
        botsQuantity={botsQuantity}
        player1Data={{
          levelsToWin: `level${problem.levelsToWin}`,
          playMode: problem.playMode
        }}
        player2Data={{
          levelsToWin: `level${problem.levelsToWin}`,
        }}
        scoreToWin={Number(problem.scoreToWin)}
        time={problem.gameTime}
        onCommit={this.handleSubmit}
        className={classes.verticalMiddle}
      />
    );
  }
}

export default compose(
  withStyles(styles)
)(GameTournamentActivity);
