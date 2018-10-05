import React, { Component } from 'react';
import { Loop, Stage } from 'react-game-kit';
import Tile from './tile';
import Characters from './characters';
import Road from './road';

import Passengers from './passengers';
import Destinations from './destination';
import Updater from './updater.js';
import Time from './time';
import './style.css';

import CodeEditor from './code-editor';

export default class App extends Component {
    render() {
        return <Loop>
            <Updater level1={this.props.level1} level2={this.props.level2} level3={this.props.level3} store={this.props.store}></Updater>
            <Time store={this.props.store}></Time>
            <div style={{height: '98vh', width: '50%', float:"left"}}>
                <Stage width={500} height={500}>
                    <Tile></Tile>
                    <Road></Road>
                    <Passengers store={this.props.store} gameId={0}></Passengers>
                    <Destinations store={this.props.store} gameId={0}></Destinations>
                    <Characters store={this.props.store} gameId={0}></Characters>
                </Stage>
            </div>
            <div style={{height: '98vh', width: '50%', float:"left"}}>
                <Stage width={500} height={500}>
                    <Tile></Tile>
                    <Road></Road>
                    <Passengers store={this.props.store} gameId={1}></Passengers>
                    <Destinations store={this.props.store} gameId={1}></Destinations>
                    <Characters store={this.props.store} gameId={1}></Characters>
                </Stage>
            </div>
            <CodeEditor></CodeEditor>
        </Loop>
    }
}