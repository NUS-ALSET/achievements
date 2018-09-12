import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Simulation from '../simulation/simulation';
import control from '../simulation/control';
import level1 from '../simulation/level1';
import level2 from '../simulation/level2';
import level3 from '../simulation/level3';
import config from '../simulation/config.json';
import Store from '../store';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/theme/github';

class Updater extends Component {
    static contextTypes = {
        loop: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.loop = this.loop.bind(this);
        this.pauseResumeGame = this.pauseResumeGame.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.changePlayer1Func = this.changePlayer1Func.bind(this);
        this.changePlayer2Func = this.changePlayer2Func.bind(this);
        Store.mode = 'pause'; // initially pause
        this.time=this.props.time || config.time;
        this.gameOver={
            status : false,
            message : ''
        }
        Store.player1Func = level3;
        Store.player2Func = control;
        this.simulation = new Simulation(config,Store.player1Func,Store.player2Func);
        this.setDefaults(props);
    }
    loop = () => {
        if(Store.mode == 'play'){
            this.gameOver = Store.time<=0 ? {
                status : true,
                winner : null,
                message : 'Time Over'
            } : Store.score[0] >= Store.scoreToWin || Store.score[1] >= Store.scoreToWin ? {
                status : true,
                winner : Store.score[0] === Store.score[1] ? 0 : Store.score[1] >= Store.scoreToWin ? 2 : 1,
                message : Store.score[0] === Store.score[1] ? 'Score is even' : Store.score[1] >= Store.scoreToWin ? 'Player 2 won!!!' : 'Player 1 won!!!'
            } : {
                status : false,
                winner : null,
                message : 'Keep Playing'
            };
            if(this.gameOver.status){
                Store.mode = 'pause';
            }
            if(Math.abs(Store.prevTime - Date.now())>=1000){
                Store.time --;
                Store.prevTime = Date.now();
            }
            var data = this.simulation.simulate();
            var gamesQount = 2;
            var charQount = 2;
            for(var i=0;i<gamesQount;i++){
                Store.updateCollectives(i, data.collectives[i]);
                Store.updateScore(i, data.score[i]);
                for(var j=0;j<charQount;j++){
                    Store.updatePosition(i, j, data.bots[i][j], 1);
                    Store.updateDirection(i, j, data.direction[i][j]);
                }
            }
        }
        if(Store.needToRestartGame){
            // var el1 = document.getElementById("player1Select");
            // var val1 = el1.options[el1.selectedIndex].value;
            // var el2 = document.getElementById("player2Select");
            // var val2 = el2.options[el2.selectedIndex].value;
            // this.setPlayer(val1,1);
            // this.setPlayer(val2,2);
            // this.restartGame();
            this.setDefaults(this.props);
            Store.needToRestartGame = false;
        }
    }
    componentWillReceiveProps(nextProps){
        this.setDefaults(nextProps);
    }
    setDefaults=(props)=>{
        if(props.player1Data){
            Object.keys(props.player1Data).forEach(key=>{
                this.changePlayer1Func({
                    target : {
                        value : props.player1Data[key]
                    }
                })
            })
            Object.keys(props.player2Data).forEach(key=>{
                this.changePlayer2Func({
                    target : {
                        value : props.player2Data[key]
                    }
                })
            })
            this.time=props.time;
            Store.scoreToWin = props.scoreToWin || config.scoreToWin;
            this.restartGame();
        }else{
            Store.mode = 'pause'
        }
    }

    changePlayer1Func(e){
        /*if(e.target.value!=="Custom code")
            Store.player1Func = eval("("+e.target.value+")");
        else
            Store.player1Func = Store.func;*/
        switch(e.target.value){
            case 'level1':
                Store.player1Func = level1;
                Store.player1ControlSelected = 'level1';
                break;
            case 'level2':
                Store.player1Func = level2;
                Store.player1ControlSelected = 'level2';
                break;
            case 'level3':
                Store.player1Func = level3;
                Store.player1ControlSelected = 'level3';
                break;
            case 'custom code':
                if(typeof Store.func == 'string')
                    Store.func = eval("("+Store.func+")");
                Store.player1Func = Store.func;
                Store.player1ControlSelected = 'custom code';
                break;
            case 'manual control':
                Store.player1Func = control;
                Store.player1ControlSelected = 'manual control';
                break;
        }
        this.restartGame();
    }
    changePlayer2Func(e){
        /*if(e.target.value!=="Custom code")
            Store.player2Func = eval("("+e.target.value+")");
        else
            Store.player2Func = Store.func;*/
        //Store.player2Func = eval(e.target.value);
        switch(e.target.value){
            case 'level1':
                Store.player2Func = level1;
                Store.player2ControlSelected = 'level1';
                break;
            case 'level2':
                Store.player2Func = level2;
                Store.player2ControlSelected = 'level2';
                break;
            case 'level3':
                Store.player2Func = level3;
                Store.player2ControlSelected = 'level3';
                break;
            // case 'custom code':
            //     if(typeof Store.func == 'string')
            //         Store.func = eval("("+Store.func+")");
            //     Store.player2Func = Store.func;
            //     Store.player2ControlSelected = 'custom code';
            //     break;
            // case 'manual control':
            //     Store.player2Func = control;
            //     Store.player2ControlSelected = 'manual control';
            //     break;
        }
        this.restartGame();
    }
    pauseResumeGame(){
        if(Store.mode == 'play')
            Store.mode = 'pause';
        else
            Store.mode = 'play';
        //Store.mode == 'play'?'pause':'play';
    }
    restartGame(){
        console.log('hello')
        this.gameOver={
            status : false,
            winner : null,
            message : 'Keep Playing'
        }
        Store.score=[0,0];
        Store.time =this.time || config.time;
        this.simulation = new Simulation(config,Store.player1Func,Store.player2Func);
        Store.mode = 'play';
    }
    componentDidMount() {
        this.loopID = this.context.loop.subscribe(this.loop);
    }
    componentWillUnmount() {
        this.context.loop.unsubscribe(this.loopID);
    }
    submitSolition=()=>{
        this.props.onCommit({
            winner : this.gameOver.winner,
            timeTaken : this.time - Store.time,
            jsCode : this.props.player1Data.playMode==='custom code' ? Store.player1Func.toString() : ''
        })
    }
    render() {
        return (<div>
            {this.gameOver.status && <div className={"gameEndWindow"} style={{
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
                    {
                        this.gameOver.message
                    }
                </h1>
                <div style={{
                    margin:'0 auto',
                    display:'block', 
                    textAlign : 'center'
                }}>
                <button style={{
                    border:'2px solid white', 
                    color:'white', 
                    background:'none',
                    padding:'10px 40px',
                    fontWeight:'bold'
                }}  onClick={() => this.restartGame()}>RESTART</button>
                <button style={{
                    border:'2px solid white', 
                    color:'white', 
                    background:'none',
                    padding:'10px 40px',
                    fontWeight:'bold',
                    marginLeft : '5px'
                }} onClick={() => this.submitSolition()}>SUBMIT SOLUTION</button>
                </div>
            </div>}
            <div style={{
                display : 'flex',
                justifyContent : 'space-between',
                width : '100%'
            }}>
            <div>
                Player 1 score: {Store.score[0]}
                {/* <select id={"player1Select"} value={Store.player1ControlSelected} onChange={this.changePlayer1Func}>
                    <option value={"custom code"}>Custom code</option>
                    <option value={"manual control"}>Manual control</option>
                    <option value={"level1"}>Level 1</option>
                    <option value={"level2"}>Level 2</option>
                    <option value={"level3"}>Level 3</option>
                </select> */}
            </div>
            <div>
                <p style={{margin:0, textAlign:'center'}}>Time left:{Store.time}</p>
                <p style={{margin:0, textAlign:'center'}}>Score to win:{Store.scoreToWin}</p>
                <button onClick={() => this.restartGame()}>Restart</button>
                <button onClick={() => this.pauseResumeGame()}>{Store.mode == 'play' ? 'Pause' : 'Resume'}</button>
            </div>
            <div>
                {/* <select id={"player2Select"} value={Store.player2ControlSelected} onChange={this.changePlayer2Func}>
                    <option value={"custom code"}>Custom code</option>
                    <option value={"manual control"}>Manual control</option>
                    <option value={"level1"}>Level 1</option>
                    <option value={"level2"}>Level 2</option>
                    <option value={"level3"}>Level 3</option>
                </select> */}
                Player 2 score: {Store.score[1]}
            </div>
            </div>
        </div>)
    }
}

export default observer(Updater);