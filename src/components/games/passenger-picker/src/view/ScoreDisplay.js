import React from 'react';
import {observer} from 'mobx-react';

const ScoreDisplay = ({store, gameId})=>{
    return <span id={"player1Holder"} style={{ color: '#ffffff' }}>Player {gameId+1} score: {store.score[gameId]} level: {store.p1Level}</span>
}

export default observer(ScoreDisplay);