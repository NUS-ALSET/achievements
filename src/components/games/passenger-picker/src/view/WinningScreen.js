import React from 'react';
import {observer} from 'mobx-react';

const WinningScreen = ({store, restartGame})=>{
    return <div>
        {store.time<=0&&<div className={"gameEndWindow"} style={{
                position:'absolute',
                width:'100%',
                height:'100vh',
                background:'green',
                zIndex:200
            }}>
                <h1 style={{
                    textAlign:'center',
                    marginTop:'40vh',
                    color:'#fff'
                }}>
                    {store.score[0]>store.score[1]?'Player 1 won!!!':''}
                    {store.score[0]<store.score[1]?'Player 2 won!!!':''}
                    {store.score[0]==store.score[1]?'Score is even!':''}
                </h1>
                <button style={{
                    margin:'0 auto',
                    display:'block', 
                    border:'3px solid white', 
                    color:'white', 
                    background:'none',
                    padding:'10px 40px',
                    fontWeight:'bold'
                }} onClick={restartGame}>RESTART</button>
            </div>}
    </div>
}

export default observer(WinningScreen);