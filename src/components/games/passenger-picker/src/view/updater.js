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
import { defaultJavascriptFunctionCode, defaultPythonCodeFunction } from './Components/defaultCode';
import { agentJavascriptFunctionCode } from './Components/defaultAgent';


const levels = [level1, level2, level3];

class Updater extends Component {
    static contextTypes = {
        loop: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.loop = this.loop.bind(this);
        this.state = {
            gameOver : {
                status: false,
                message: ''
            }
        }
        this.pauseResumeGame = this.pauseResumeGame.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.updateStateFromProps = this.updateStateFromProps.bind(this);

        this.props.store.player1Func = props.player1Data.jsCode || defaultJavascriptFunctionCode;
        this.props.store.player2Func = (props.player2Data || {}).jsCode || agentJavascriptFunctionCode;
        this.props.store.mode = 'pause'; // initially pause
        this.time = this.props.gameData.gameTime || config.time;
        this.simulation = new Simulation(config, this.evaluateStringCode(this.props.store.player1Func), this.evaluateStringCode(this.props.store.player2Func), this.props.gameData.botsQuantities);
    }

    loop = () => {
        if (this.props.store.mode == 'play') {
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
            this.state.gameOver.status!== gameOver.status && this.setState({ gameOver });
            if (gameOver.status) {
                this.props.store.mode = 'pause';
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
        console.log(props);
        if (props.player1Data) {
            this.props.store.mode = 'pause';
            this.props.store.time = this.time;
            this.props.store.scoreToWin = props.gameData.scoreToWin || config.scoreToWin;
            this.props.store.botsQuantity = props.gameData.botsQuantities || this.props.store.botsQuantity;
            this.props.store.player1Func = this.props.player1Data.jsCode || defaultJavascriptFunctionCode;
            this.props.store.player2Func = (this.props.player2Data || {}).jsCode || agentJavascriptFunctionCode;
            this.restartGame();
        } else {
            this.props.store.mode = 'pause'
        }

    }

    pauseResumeGame() {
        if (this.props.store.mode == 'play')
            this.props.store.mode = 'pause';
        else
            this.props.store.mode = 'play';
        //this.props.store.mode == 'play'?'pause':'play';
    }
    restartGame() {
        this.setState({
            gameOver : {
                status: false,
                winner: null,
                message: 'Keep Playing'
            }
        })
        this.simulation = new Simulation(config, this.evaluateStringCode(this.props.store.player1Func), this.evaluateStringCode(this.props.store.player2Func), this.props.gameData.botsQuantities);
        this.props.store.time = this.props.gameData.gameTime || config.time;
        this.props.store.mode = 'play';

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
            result: this.state.gameOver.winner===0 ? 'NONE' : this.state.gameOver.winner == 1 ? "WON" : 'LOST',
            timeTaken: this.time - this.props.store.time,
            jsCode: this.props.player1Data.playMode === 'custom code' ? this.props.store.player1Func.toString() : ''
        })
    }
    componentDidMount() {
        this.loopID = this.context.loop.subscribe(this.loop);
        this.updateStateFromProps(this.props);        
        this.restartGame();
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
            <ScoreDisplay store={this.props.store} restartGame={this.restartGame} pauseResumeGame={this.pauseResumeGame} ></ScoreDisplay>
        </div>)
    }
}

export default observer(Updater);