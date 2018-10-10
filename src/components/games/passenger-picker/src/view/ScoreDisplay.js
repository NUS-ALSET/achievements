/* eslint-disable */
import React from 'react';
import { observer } from 'mobx-react';

const ScoreDisplay = ({ store, restartGame, pauseResumeGame }) => {
    return <div className="score-display">
        <div>Player 1 score: {store.score[0]}</div>
        <div>
            Time left: {store.time} sec
        </div>
        <div>
            <button className="btn control-btn restart" onClick={() => restartGame()}> Restart </button>
            <button className="btn control-btn pause" onClick={() => pauseResumeGame()}> {store.mode == 'play' ? 'Pause' : 'Resume'} </button>
        </div>
        <div>Level: {store.currentLevel}</div>
        <div>Player 2 score: {store.score[1]}</div>
    </div>
}

export default observer(ScoreDisplay);