import React from 'react';
import {observer} from 'mobx-react';

const ScoreDisplay = ({ store, restartGame, pauseResumeGame }) => (
    <div className='scoreDisplay' id="player1Holder">
        <div>Player 1 score: {store.score[0]} level: {store.p1Level}</div>
        <div>
            <button onClick={() => restartGame()}> Restart </button>
            {` Time left: ${store.time} `}
            <button onClick={() => pauseResumeGame()}>
                {store.mode == 'play' ? 'Pause' : 'Resume'}
            </button>
        </div>
        <div>Player 2 score: {store.score[1]} level: {store.p1Level}</div>
    </div>
);

export default observer(ScoreDisplay);