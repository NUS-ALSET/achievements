import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Simulation from '../simulation/simulation';
import control from '../simulation/control';
import level1 from '../simulation/level1';
import level2 from '../simulation/level2';
import level3 from '../simulation/level3';
import config from '../simulation/config.json';
import WinningScreen from './WinningScreen';
import ScoreDisplay from './ScoreDisplay';
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
        if(this.props.level1)
            this.level1 = this.props.level1;
        else
            this.level1 = level1;
        if(this.props.level2)
            this.level2 = this.props.level2;
        else
            this.level2 = level2;
        if(this.props.level3)
            this.level3 = this.props.level3;
        else
            this.level3 = level3;
        this.loop = this.loop.bind(this);
        this.pauseResumeGame = this.pauseResumeGame.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.changePlayer1Func = this.changePlayer1Func.bind(this);
        this.changePlayer2Func = this.changePlayer2Func.bind(this);
        this.changeBotsQuantity = this.changeBotsQuantity.bind(this);
        this.props.store.player1Func = level3;
        this.props.store.player2Func = control;
        if(this.getURLParameters('player1')){
            var funcName = this.getURLParameters('player1');
            switch(funcName){
                case 'control':
                    this.props.store.player1Func = control;
                    this.props.store.player1ControlSelected = 'manual control';
                    break;
                case 'level1':
                    this.props.store.player1Func = level1;
                    this.props.store.player1ControlSelected = 'level1';
                    break;
                case 'level2':
                    this.props.store.player1Func = level2;
                    this.props.store.player1ControlSelected = 'level2';
                    break;
                case 'level3':
                    this.props.store.player1Func = level3;
                    this.props.store.player1ControlSelected = 'level3';
                    break;
                case 'custom code':
                    this.props.store.player1Func = this.props.store.func;
                    this.props.store.player1ControlSelected = 'custom code';
                    break;
                default:
                    break
            }
        }
        if(this.getURLParameters('player2')){
            var funcName = this.getURLParameters('player2');
            switch(funcName){
                case 'control':
                    this.props.store.player2Func = control;
                    this.props.store.player2ControlSelected = 'manual control';
                    break;
                case 'level1':
                    this.props.store.player2Func = level1;
                    this.props.store.player2ControlSelected = 'level1';
                    break;
                case 'level2':
                    this.props.store.player2Func = level2;
                    this.props.store.player2ControlSelected = 'level2';
                    break;
                case 'level3':
                    this.props.store.player2Func = level3;
                    this.props.store.player2ControlSelected = 'level3';
                    break;
                case 'custom code':
                    this.props.store.player2Func = this.props.store.func;
                    this.props.store.player2ControlSelected = 'custom code';
                    break;
                default:
                    break;
            }
        }
        this.simulation = new Simulation(config,this.props.store.player1Func,this.props.store.player2Func,config.botsQuantityPerGame);
    }
    loop = () => {
        if(this.props.store.mode == 'play'){
            if(this.props.store.time<=0){
                this.props.store.mode = 'pause'
            }
            if(Math.abs(this.props.store.prevTime - Date.now())>=1000){
                this.props.store.time --;
                this.props.store.prevTime = Date.now();
            }
            var data = this.simulation.simulate();
            var gamesQount = 2;
            var charQount = data.bots[0].length;
            for(var i=0;i<gamesQount;i++){
                this.props.store.updatePassengers(i, data.collectives[i]);
                this.props.store.updateScore(i, data.score[i]);
                for(var j=0;j<charQount;j++){
                    this.props.store.updatePosition(i, j, data.bots[i][j], 1);
                    this.props.store.updateDirection(i, j, data.direction[i][j]);
                    this.props.store.updateDestination(i, j, data.bots[i][j].passenger);
                }
            }
        }
        if(this.props.store.needToRestartGame){
            var el1 = document.getElementById("player1Select");
            var val1 = el1.options[el1.selectedIndex].value;
            var el2 = document.getElementById("player2Select");
            var val2 = el2.options[el2.selectedIndex].value;
            this.setPlayer(val1,1);
            this.setPlayer(val2,2);
            this.restartGame();
            this.props.store.needToRestartGame = false;
        }
    }
    setPlayer(value, playerId){
        switch(value){
            case 'level1':
                if(playerId==1){
                    this.props.store.player1Func = level1;
                    this.props.store.player1ControlSelected = 'level1';}
                else{
                    this.props.store.player2Func = level1;
                    this.props.store.player2ControlSelected = 'level1';}
                break;
            case 'level2':
                if(playerId==1){
                    this.props.store.player1Func = level2;
                    this.props.store.player1ControlSelected = 'level2';}
                else{
                    this.props.store.player2Func = level2;
                    this.props.store.player2ControlSelected = 'level2';}
                break;
            case 'level3':
                if(playerId==1){
                    this.props.store.player1Func = level3;
                    this.props.store.player1ControlSelected = 'level3';}
                else{
                    this.props.store.player2Func = level3;
                    this.props.store.player2ControlSelected = 'level3';}
                break;
            case 'custom code':
                if(playerId==1){
                    this.props.store.player1Func = this.props.store.func;
                    this.props.store.player1ControlSelected = 'custom code';}
                else{
                    this.props.store.player2Func = this.props.store.func;
                    this.props.store.player2ControlSelected = 'custom code';}
                break;
            case 'manual control':
                if(playerId==1){
                    this.props.store.player1Func = control;
                    this.props.store.player1ControlSelected = 'manual control';}
                else{
                    this.props.store.player2Func = control;
                    this.props.store.player2ControlSelected = 'manual control';}
                break;
        }
    }
    getURLParameters(paramName)
    {
        var sURL = window.document.URL.toString();
        if (sURL.indexOf("?") > 0)
        {
            var arrParams = sURL.split("?");
            var arrURLParams = arrParams[1].split("&");
            var arrParamNames = new Array(arrURLParams.length);
            var arrParamValues = new Array(arrURLParams.length);

            var i = 0;
            for (i = 0; i<arrURLParams.length; i++)
            {
                var sParam =  arrURLParams[i].split("=");
                arrParamNames[i] = sParam[0];
                if (sParam[1] != "")
                    arrParamValues[i] = unescape(sParam[1]);
                else
                    arrParamValues[i] = "No Value";
            }
            for (i=0; i<arrURLParams.length; i++)
            {
                if (arrParamNames[i] == paramName)
                {
                    //alert("Parameter:" + arrParamValues[i]);
                    return arrParamValues[i];
                }
            }
            return false;
        }
    }
    changeBotsQuantity(e){
        this.props.store.mode = 'pause';
        if(e.target.value!==this.props.store.botsQuantity){
            this.props.store.botsQuantity = e.target.value;
            this.restartGame();
        }
    }
    changePlayer1Func(e){
        /*if(e.target.value!=="Custom code")
            this.props.store.player1Func = eval("("+e.target.value+")");
        else
            this.props.store.player1Func = this.props.store.func;*/
        switch(e.target.value){
            case 'level1':
                this.props.store.player1Func = level1;
                this.props.store.player1ControlSelected = 'level1';
                break;
            case 'level2':
                this.props.store.player1Func = level2;
                this.props.store.player1ControlSelected = 'level2';
                break;
            case 'level3':
                this.props.store.player1Func = level2;
                this.props.store.player1ControlSelected = 'level3';
                break;
            case 'custom code':
                if(typeof this.props.store.func == 'string')
                    this.props.store.func = eval("("+this.props.store.func+")");
                this.props.store.player1Func = this.props.store.func;
                this.props.store.player1ControlSelected = 'custom code';
                break;
            case 'manual control':
                this.props.store.player1Func = control;
                this.props.store.player1ControlSelected = 'manual control';
                break;
        }
        this.restartGame();
    }
    changePlayer2Func(e){
        /*if(e.target.value!=="Custom code")
            this.props.store.player2Func = eval("("+e.target.value+")");
        else
            this.props.store.player2Func = this.props.store.func;*/
        //this.props.store.player2Func = eval(e.target.value);
        switch(e.target.value){
            case 'level1':
                this.props.store.player2Func = level1;
                this.props.store.player2ControlSelected = 'level1';
                break;
            case 'level2':
                this.props.store.player2Func = level2;
                this.props.store.player2ControlSelected = 'level2';
                break;
            case 'level3':
                this.props.store.player2Func = level2;
                this.props.store.player2ControlSelected = 'level3';
                break;
            case 'custom code':
                if(typeof this.props.store.func == 'string')
                    this.props.store.func = eval("("+this.props.store.func+")");
                this.props.store.player2Func = this.props.store.func;
                this.props.store.player2ControlSelected = 'custom code';
                break;
            case 'manual control':
                this.props.store.player2Func = control;
                this.props.store.player2ControlSelected = 'manual control';
                break;
        }
        this.restartGame();
    }
    pauseResumeGame(){
        if(this.props.store.mode == 'play')
            this.props.store.mode = 'pause';
        else
            this.props.store.mode = 'play';
        //this.props.store.mode == 'play'?'pause':'play';
    }
    restartGame(){
        this.props.store.time = config.time;
        this.simulation = new Simulation(config,this.props.store.player1Func,this.props.store.player2Func,this.props.store.botsQuantity);
        this.props.store.mode = 'play';
    }
    componentDidMount() {
        this.loopID = this.context.loop.subscribe(this.loop);
    }
    componentWillUnmount() {
        this.context.loop.unsubscribe(this.loopID);
    }
    render() {
        return (<div>
            <WinningScreen store={this.props.store} restartGame={this.restartGame}/>
            <p style={{position:'absolute', left:0, top:0, margin:0, zIndex:100}}>
                <ScoreDisplay store={this.props.store} gameId={0}></ScoreDisplay>
                <select id={"player1Select"} value={this.props.store.player1ControlSelected} onChange={this.changePlayer1Func}>
                    <option value={"custom code"}>Custom code</option>
                    <option value={"manual control"}>Manual control</option>
                    <option value={"level1"}>Level 1</option>
                    <option value={"level2"}>Level 2</option>
                    <option value={"level3"}>Level 3</option>
                </select>
            </p>
            <p style={{position:'absolute', right:0, top:0, margin:0, zIndex:100}}>
                <select id={"player2Select"} value={this.props.store.player2ControlSelected} onChange={this.changePlayer2Func}>
                    <option value={"custom code"}>Custom code</option>
                    <option value={"manual control"}>Manual control</option>
                    <option value={"level1"}>Level 1</option>
                    <option value={"level2"}>Level 2</option>
                    <option value={"level3"}>Level 3</option>
                </select>
                <ScoreDisplay store={this.props.store} gameId={1}></ScoreDisplay>
            </p>
            <p style={{position:'absolute', left:'50%', top:'15px', transform:'translate(-50%, -50%)', zIndex:100}}>
                <button onClick={() => this.restartGame()}>Restart</button>
                <button onClick={() => this.pauseResumeGame()}>{this.props.store.mode == 'play' ? 'Pause' : 'Resume'}</button>
                <select id={"botsQuantity"} value={this.props.store.botsQuantity} onChange={this.changeBotsQuantity}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                </select>
            </p>
        </div>)
    }
} 

export default observer(Updater);