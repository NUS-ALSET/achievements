import React from 'react';
import {observer} from 'mobx-react';

const WinningScreen = ({ restartGame, gameOver, submitSolition})=>{
    console.log(gameOver);
    return <div>
        {gameOver.status &&<div className={"gameEndWindow"} style={{
                position:'fixed',
                width:'100%',
                height:'100vh',
                background:'green',
                zIndex:2000
            }}>
                <h1 style={{
                    textAlign:'center',
                    marginTop:'40vh',
                    color:'#fff'
                }}>
                    {gameOver.message}
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
                <br></br>
                <button style={{
                    margin:'0 auto',
                    display:'block', 
                    border:'3px solid white', 
                    color:'white', 
                    background:'none',
                    padding:'10px 40px',
                    fontWeight:'bold'
                }} onClick={submitSolition}>SUBMIT SOLUTION</button>
            </div>}
    </div>
}

export default observer(WinningScreen);