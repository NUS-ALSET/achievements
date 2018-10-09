import React from 'react';
import { observer } from 'mobx-react';

const ScoreDisplay = ({ store, restartGame, pauseResumeGame }) => {
    return <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row', width: '100%',
        backgroundColor: '#e8e8e8',
        padding: '16px',
        fontSize: '20px'
    }}>
        <div>Player 1 score: {store.score[0]}</div>
        <div>
            <button onClick={() => restartGame()}> Restart </button>
            {` Time left: ${store.time} `}
            <button onClick={() => pauseResumeGame()}> {store.mode == 'play' ? 'Pause' : 'Resume'} </button>
        </div>
        <div>Player 2 score: {store.score[1]}</div>

    </div>
}

export default observer(ScoreDisplay);