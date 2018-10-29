import React from 'react';
import { observer } from 'mobx-react';

const ScoreDisplay = ({ store, restartGame, pauseResumeGame, playAsPlayer2, intiGame }) => {
  return <div className="score-display">
    <div> {playAsPlayer2 ? 'Bot' : 'My'} Score: {store.score[0]}</div>
    <div>
      Time Left: {store.time} sec
        </div>
    <div>
      <button className="btn control-btn restart" onClick={() => restartGame()}> {intiGame ? 'Start Game' : 'Restart'}</button>
      {!intiGame && <button className="btn control-btn pause" onClick={() => pauseResumeGame()}> {store.mode === 'play' ? 'Pause' : 'Resume'} </button>}
    </div>
    <div>Level: {store.currentLevel}</div>
    <div> {playAsPlayer2 ? 'My' : 'Bot'} Score: {store.score[1]}</div>
  </div>
}

export default observer(ScoreDisplay);