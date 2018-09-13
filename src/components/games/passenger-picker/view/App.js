/* eslint-disable */
import React, { Component } from 'react';
import { Loop, Stage } from 'react-game-kit';
//import Store from './store';
import Tile from './tile';
import Character from './character';
import Road from './road';

import Passengers from './passengers';
import Destinations from './destination';
import Updater from './updater.js';
import './style.css';

import CodeEditor from './code-editor';
        
const defaultPlayer1Data={
    levelsToWin : 'level1',
    playMode : 'manual control'
}
const defaultPlayer2Data={
    levelsToWin : 'level1',
}
export default class App extends Component {
    render() {
    const { player1Data = defaultPlayer1Data, player2Data = defaultPlayer2Data, time, scoreToWin, onCommit } = this.props;
        return <Loop>
            <Updater 
                player1Data={player1Data} 
                player2Data={player2Data} 
                scoreToWin={scoreToWin}
                time={time}
                onCommit={onCommit}
            />
            <div style={{height: '95vh', maxHeight : '650px', width: '50%', float:"left"}}>
                <Stage width={500} height={500}>
                    <Tile></Tile>
                    <Road></Road>
                    <Passengers gameId={0}></Passengers>
                    <Destinations gameId={0}></Destinations>
                    <Character gameId={0} charId={0} type={'white-car'}></Character>
                    <Character gameId={0} charId={1} type={'orange-car'}></Character>
                </Stage>
            </div>
            <div style={{height: '95vh',maxHeight : '650px', width: '50%', float:"left"}}>
                <Stage width={500} height={500}>
                    <Tile></Tile>
                    <Road></Road>
                    <Passengers gameId={1}></Passengers>
                    <Destinations gameId={1}></Destinations>
                    <Character gameId={1} charId={0} type={'black-car'}></Character>
                    <Character gameId={1} charId={1} type={'blue-car'}></Character>
                </Stage>
            </div>
            {
                player1Data.playMode ==='custom code' && <CodeEditor></CodeEditor>
            }
            
        </Loop>
    }
}