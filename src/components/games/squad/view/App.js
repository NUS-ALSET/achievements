/* eslint-disable */
import React, { Component } from "react";
import { Loop, Stage } from "react-game-kit";

import Tile from "./tile";
import Character from "./character";

import Collectives from "./collectives";
import Updater from "./updater.js";
import "./style.css";

import CodeEditor from "./code-editor";

const defaultPlayer1Data = {
  levelsToWin: "level1",
  playMode: "manual control"
};
const defaultPlayer2Data = {
  levelsToWin: "level1"
};
export default class App extends Component {
  render() {
    const {
      player1Data = defaultPlayer1Data,
      player2Data = defaultPlayer2Data,
      time,
      scoreToWin,
      onCommit
    } = this.props;
    return (
      <Loop>
        <Updater
          player1Data={player1Data}
          player2Data={player2Data}
          scoreToWin={scoreToWin}
          time={time}
          onCommit={onCommit}
        />
        <div
          style={{
            display: "flex",
            width: "100%"
          }}
        >
          <div style={{ height: "calc(100vh - 140px)", width: "100%" }}>
            <Stage height={window.screen.availHeight - 300}>
              <Tile />
              <Collectives gameId={0} />
              <Character gameId={0} charId={0} type={"drone1"} />
              <Character gameId={0} charId={1} type={"drone2"} />
            </Stage>
          </div>
          <div style={{ height: "calc(100vh - 140px)", width: "100%" }}>
            <Stage height={window.screen.availHeight - 300}>
              <Tile />
              <Collectives gameId={1} />
              <Character gameId={1} charId={0} type={"drone2"} />
              <Character gameId={1} charId={1} type={"drone3"} />
            </Stage>
          </div>
        </div>
        {player1Data.playMode === "custom code" && <CodeEditor />}
      </Loop>
    );
  }
}
