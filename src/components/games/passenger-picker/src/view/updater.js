/* eslint-disable */
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

import { defaultJavascriptFunctionCode, defaultPythonCodeFunction } from './Components/defaultCode';


const levels = [level1, level2, level3];
const PLAY = 'play';
const PAUSE = 'pause';
const CUSTOM_CODE = 'custom code';

class Updater extends Component {
    static contextTypes = {
        loop: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.loop = this.loop.bind(this);
        this.state = {
            gameOver: {
                status: false,
                message: ''
            }
        }
        this.pauseResumeGame = this.pauseResumeGame.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
    }

    loop = () => {
        if (this.props.store.mode == PLAY) {
            const gameOver = this.props.store.time <= 0 ? {
                status: true,
                winner: null,
                message: 'Time Over'
            } : this.props.store.score[0] >= this.props.store.scoreToWin || this.props.store.score[1] >= this.props.store.scoreToWin ? {
                status: true,
                winner: this.props.store.score[0] === this.props.store.score[1] ? 0 : this.props.store.score[1] >= this.props.store.scoreToWin ? 2 : 1,
                message: this.props.store.score[0] === this.props.store.score[1] ? 'Score is even' : this.props.store.score[1] >= this.props.store.scoreToWin ? 'Player 2 won!!!' : 'Player 1 won!!!'
            } : {
                        status: false,
                        winner: null,
                        message: 'Keep Playing'
                    };
            this.setState({ gameOver });
            if (gameOver.status) {
                this.props.store.mode = PAUSE;
            }
            if (Math.abs(this.props.store.prevTime - Date.now()) >= 1000) {
                this.props.store.time--;
                this.props.store.prevTime = Date.now();
            }
            var data = this.simulation.simulate();
            var gamesQount = 2;
            var charQount = data.bots[0].length;

            for (var i = 0; i < gamesQount; i++) {
                this.props.store.updatePassengers(i, data.collectives[i]);
                this.props.store.updateScore(i, data.score[i]);
                for (var j = 0; j < charQount; j++) {
                    // !data.bots[i][j] && console.log(data.bots, i, j)
                    this.props.store.updatePosition(i, j, data.bots[i][j], 1);
                    this.props.store.updateDirection(i, j, data.direction[i][j]);
                    this.props.store.updateDestination(i, j, data.bots[i][j].passenger);
                }
            }
        }
        if (this.props.store.needToRestartGame) {
            this.props.store.player1Func = this.props.store.func;
            this.restartGame();
            this.props.store.needToRestartGame = false;
        }
    }

    updateStateFromProps(props) {
        if (props.player1Data) {
            this.props.store.mode = PAUSE;
            this.gameTime = this.props.gameData.gameTime || config.time;
            this.props.store.time = this.gameTime;
            this.props.store.scoreToWin = props.gameData.scoreToWin || config.scoreToWin;
            this.props.store.botsQuantity = Math.min(props.gameData.botsQuantities || props.store.botsQuantity, config.maxBotsQuantityPerGame);
            this.props.store.currentLevel = Math.min(Number(props.gameData.levelsToWin) || 1, 3);
            if(this.props.playAsPlayer2){
                this.props.store.player2Func = props.gameData.playMode === CUSTOM_CODE ? props.player1Data.jsCode || defaultJavascriptFunctionCode : control;
                this.props.store.player1Func = (props.player2Data || {}).jsCode || levels[props.gameData.levelsToWin - 1];
            }else{
                this.props.store.player1Func = props.gameData.playMode === CUSTOM_CODE ? props.player1Data.jsCode || defaultJavascriptFunctionCode : control;
                this.props.store.player2Func = (props.player2Data || {}).jsCode || levels[props.gameData.levelsToWin - 1];
            }
            this.restartGame();
        } else {
            this.props.store.mode = PAUSE;
        }

    }

    pauseResumeGame() {
        this.props.store.mode = this.props.store.mode === PLAY ? PAUSE : PLAY;
    }
    restartGame(gameState=PLAY) {
        this.setState({
            gameOver: {
                status: false,
                winner: null,
                message: 'Keep Playing'
            }
        })
        this.props.store.score = [0, 0];
        this.props.store.time = this.props.gameData.gameTime || config.time;
        this.simulation = new Simulation(
            config,
            this.evaluateStringCode(this.props.store.player1Func),
            this.evaluateStringCode(this.props.store.player2Func),
            this.props.gameData.botsQuantities
        );
        this.props.store.mode = gameState;

    }
    evaluateStringCode = (code) => {
        if (typeof code == 'string') {
            try {
                return eval("(" + code + ")");
            } catch (error) {
                // console.log(error);
                return () => { return { right: true } };
            }
        }
        return code;
    }
    submitSolition = () => {
        this.props.onCommit({
            status: this.state.gameOver.winner === 0 ? 'DRAW' : this.state.gameOver.winner == 1 ? "WON" : 'LOST',
            result: this.state.gameOver.winner === 0 ? 'NONE' : this.state.gameOver.winner == 1 ? "WON" : 'LOST',
            score: [this.props.store.score[0], this.props.store.score[1]],
            timeTaken: this.gameTime - this.props.store.time,
            jsCode: this.props.gameData.playMode === CUSTOM_CODE  && this.props.store.editorMode==='javascript' ? this.props.store.player1Func.toString() : '',
            pyCode : this.props.gameData.playMode === CUSTOM_CODE && this.props.store.editorMode==='python' ? this.props.store.editorPyCode : ''
        })
    }
    componentDidMount() {
        this.loopID = this.context.loop.subscribe(this.loop);
        this.updateStateFromProps(this.props);
        this.restartGame(PAUSE);
    }
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }
    componentWillUnmount() {
        this.context.loop.unsubscribe(this.loopID);
    }

    render() {
        return (<div>
            <WinningScreen gameOver={this.state.gameOver} restartGame={this.restartGame} submitSolition={this.submitSolition} />
            <ScoreDisplay store={this.props.store} intiGame={this.gameTime===this.props.store.time} playAsPlayer2={this.props.playAsPlayer2} restartGame={this.restartGame} pauseResumeGame={this.pauseResumeGame} />
        </div>)
    }
}

export default observer(Updater);