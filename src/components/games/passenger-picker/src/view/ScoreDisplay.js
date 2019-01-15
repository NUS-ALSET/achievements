/* eslint-disable */
import React from "react";
import { observer } from "mobx-react";

const ScoreDisplay = ({
  store,
  restartGame,
  pauseResumeGame,
  playAsPlayer2,
  intiGame,
  playersName,
  mode,
  units,
  scoreToWin
}) => {
  const levels = ["Easy", "Medium", "Hard"];
  return (
    <div>
      <div className="game-info">
        <div>Time Left: {store.time} seconds</div>
        <div>Taxis to control: {units}</div>
        <div>Mode: {mode}</div>
        <div>Score to win: {scoreToWin} points</div>
      </div>
      <div className="score-display">
        <div>
          {" "}
          Player 1:{" "}
          {playAsPlayer2
            ? `${levels[Number(store.currentLevel) - 1]}-Bot`
            : playersName
            ? playersName["player1"]
            : "Me"}
        </div>
        <div>
          {" "}
          Player 2:{" "}
          {!playAsPlayer2
            ? `${levels[Number(store.currentLevel) - 1]}-Bot`
            : playersName
            ? playersName["player1"]
            : "Me"}
        </div>
      </div>
      <div className="score-display bg-grey">
        <div>
          {" "}
          {playAsPlayer2 ? "Bot" : "My"} Score: {store.score[0]}
        </div>
        <div>
          <button
            className="btn control-btn restart"
            onClick={() => restartGame()}
          >
            {" "}
            {intiGame ? "Start Game" : "Restart"}
          </button>
          {!intiGame && (
            <button
              className="btn control-btn pause"
              onClick={() => pauseResumeGame()}
            >
              {" "}
              {store.mode == "play" ? "Pause" : "Resume"}{" "}
            </button>
          )}
        </div>
        <div>
          {" "}
          {playAsPlayer2 ? "My" : "Bot"} Score: {store.score[1]}
        </div>
      </div>
    </div>
  );
};

export default observer(ScoreDisplay);
