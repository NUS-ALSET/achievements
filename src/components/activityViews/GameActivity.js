/**
 * @created 11.09.18
 */

import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
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
    const { problem,
      classes,
      solution,
      displayName
      // , readOnly, onCommit, taskId 
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
          gameType: problem.type,
        }}
        player1Data={{
          pyCode : (solution || {}).pyCode || '' ,
          jsCode : (solution || {}).jsCode || ''
        }}
        playAsPlayer2={problem.playAsPlayer2} // default false
        onCommit={this.handleSubmit}
        playersName = {{
          player1 : problem.playAsPlayer2 ? 'Bot' : displayName,
          player2 : !problem.playAsPlayer2 ? 'Bot' : displayName
        }}
        className={classes.verticalMiddle}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    displayName : state.firebase.auth.displayName || '',
  }
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
  )
)(GameActivity);
