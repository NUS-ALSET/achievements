/* eslint-disable */
import React, { Component } from "react";
import { Loop, Stage } from "react-game-kit";
import Tile from "./tile";
import Characters from "./characters";
import Road from "./road";

import Passengers from "./passengers";
import Destinations from "./destination";
import Updater from "./updater.js";
import CodeEditor from "./code-editor";
import config from "../simulation/config.json";

export default class App extends Component {
  render() {
    const playerKeys = this.props.playAsPlayer2
      ? config.player2Keys
      : config.player1Keys;
    return (
      <Loop>
        <Updater {...this.props} />
        <div className="stage">
          <Stage width={800} height={480}>
            <Tile />
            <Road />
            <Passengers store={this.props.store} gameId={0} />
            <Destinations store={this.props.store} gameId={0} />
            <Characters store={this.props.store} gameId={0} />
          </Stage>
        </div>
        <div className="stage">
          <Stage width={800} height={480}>
            <Tile />
            <Road />
            <Passengers store={this.props.store} gameId={1} />
            <Destinations store={this.props.store} gameId={1} />
            <Characters store={this.props.store} gameId={1} />
          </Stage>
        </div>
        <div className="clear-both" />

        {this.props.gameData.playMode === "custom code" ? (
          <CodeEditor player1Data={this.props.player1Data} />
        ) : (
          <div className="instructions">
            Manual Control:
            <br />
            Control the units on your map by pressing
            <ul>
              {Object.keys(playerKeys).map(key => (
                <li key={key}>
                  {" "}
                  {key.toUpperCase()}: {playerKeys[key]}{" "}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Loop>
    );
  }
}
