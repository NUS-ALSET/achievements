/**
 * @created 11.09.18
 */

import React from "react";
import PropTypes from "prop-types";


const Loading = () => {
  return "Loading...";
};

const Game404 = () => {
  return "Game not exist";
};

class GameTournamentActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.selectGame(props);
    this.state = {
      specificGame: null
    };
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
      this.props.onCommit({ type: "SOLUTION", solution });
    } else {
      this.props.onCommit(solution, this.props.taskId);
    }
  }
  selectGame = (props) => {
    const { problem = {} } = props;
    switch (problem.game) {
      case "passenger-picker": {
        import("../games/passenger-picker/src/component")
          .then(({ Game }) => {
            this.setState({ specificGame: Game });
          });
        break;
      }
      case "squad": {
        import("../games/squad")
          .then(({ Game }) => {
            this.setState({ specificGame: Game });
          });
        break;
      }
      default: {
        this.setState({ specificGame: Game404 });
      }
    }
  }
  render() {
    const { problem, botsQuantity
      // solution, readOnly, onCommit, taskId
    } = this.props;
    if (!problem) {
      return "";
    }
    const SpecificGame = this.state.specificGame || Loading;
    return (
      <SpecificGame
        botsQuantity={botsQuantity}
        onCommit={this.handleSubmit}
        player1Data={{
          levelsToWin: `level${problem.levelsToWin}`,
          playMode: problem.playMode
        }}
        player2Data={{
          levelsToWin: `level${problem.levelsToWin}`
        }}
        scoreToWin={Number(problem.scoreToWin)}
        time={problem.gameTime}
        tournament
      />
    );
  }
}

export default GameTournamentActivity;
