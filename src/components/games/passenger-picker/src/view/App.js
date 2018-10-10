/* eslint-disable */
import React, { Component } from 'react';
import { Loop, Stage } from 'react-game-kit';
import Tile from './tile';
import Characters from './characters';
import Road from './road';

import Passengers from './passengers';
import Destinations from './destination';
import Updater from './updater.js';
import CodeEditor from './code-editor';



export default class App extends Component {
    render() {
        return <Loop>
            <Updater {...this.props}></Updater>
            <div className="stage">
                <Stage width={800} height={480}>
                    <Tile></Tile>
                    <Road></Road>
                    <Passengers store={this.props.store} gameId={0}></Passengers>
                    <Destinations store={this.props.store} gameId={0}></Destinations>
                    <Characters store={this.props.store} gameId={0}></Characters>
                </Stage>
            </div>
            <div className="stage">
                <Stage width={800} height={480}>
                    <Tile></Tile>
                    <Road></Road>
                    <Passengers store={this.props.store} gameId={1}></Passengers>
                    <Destinations store={this.props.store} gameId={1}></Destinations>
                    <Characters store={this.props.store} gameId={1}></Characters>
                </Stage>
            </div>
            <div className="clear-both">            </div>
            {
                this.props.gameData.playMode === 'custom code' && 
                <CodeEditor player1Data={this.props.player1Data} ></CodeEditor>
            }
        </Loop>
    }
}