import level1 from './level1';
import level2 from './level2';
import level3 from './level3';
import config from './config.json';
import React, { Component } from 'react';
import tableResult from './table-result';
import App from '../view/App';
import { observer } from 'mobx-react';
import Store from '../store';

class Tournament extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      presult: "",
      showTable: true,
      gameTitle: '',
      firstTimeRunGame: false,
      gameData: props.gameData,
      player1Data: props.player1Data,
      playAsPlayer2: props.playAsPlayer2
    }
    if (this.state.player1Data.jsCode) {
      Store.func = this.state.player1Data.jsCode;
    }
    else if (this.state.player1Data.pyCode) {
      window.createFunctionFromPython(this.state.player1Data.pyCode);
      Store.func = window.getPlayersCommands;
      Store.editorPyCode = this.state.player1Data.pyCode;
    }
    if (typeof Store.func === 'string')
      // eslint-disable-next-line
      Store.func = eval('(' + Store.func + ')');
    Object.defineProperty(level3, "name", { value: "Hard bot" });
    Object.defineProperty(level2, "name", { value: "Medium bot" });
    Object.defineProperty(level1, "name", { value: "Easy bot" });
    Object.defineProperty(Store.func, "name", { value: "You" });
  }
  attachClickEvent() {
    var restartGame = document.getElementsByClassName('restartGame');
    for (var i = 0; i < restartGame.length; i++) {
      restartGame[i].onclick = (e) => {
        e.preventDefault();
        Store.player1Func = this.evaluateCode(e.target.attributes[1].value === 'level1' || 'level2' || 'level3' ? e.target.attributes[1].value : 'custom code');
        Store.player2Func = this.evaluateCode(e.target.attributes[2].value === 'level1' || 'level2' || 'level3' ? e.target.attributes[2].value : 'custom code');
        // eslint-disable-next-line
        this.state.gameTitle = e.target.attributes[1].value + ' vs ' + e.target.attributes[2].value;
        if (Store.player2Func.name === "You") {
          // eslint-disable-next-line
          this.state.playAsPlayer2 = true;
          // eslint-disable-next-line
          this.state.gameData.levelsToWin = this.getLevelToBeat(Store.player1Func.name);
        }
        else {
          // eslint-disable-next-line
          this.state.playAsPlayer2 = false;
          // eslint-disable-next-line
          this.state.gameData.levelsToWin = this.getLevelToBeat(Store.player2Func.name);
        }
        if (Store.player1Func.name === "You" || Store.player2Func.name === "You") {
          if (Store.editorPyCode)
            // eslint-disable-next-line
            this.state.player1Data.pyCode = Store.editorPyCode;
          Store.showGameSimulation = true;
          Store.needToRestartGame = true;
        }
      };
    }
  }
  getLevelToBeat(levelName) {
    switch (levelName) {
      case 'level1':
        return 1;
      case 'level2':
        return 2;
      case 'level3':
        return 3;
      case 'Easy bot':
        return 1;
      case 'Medium bot':
        return 2;
      case 'Hard bot':
        return 3;
      default:
        return 1;
    }
  }
  evaluateCode(code) {
    switch (code) {
      case 'level1':
        return level1;
      case 'level2':
        return level2;
      case 'level3':
        return level3;
      case 'Easy bot':
        return level1;
      case 'Medium bot':
        return level2;
      case 'Hard bot':
        return level3;
      default:
        if (typeof Store.func === 'string')
          // eslint-disable-next-line
          Store.func = eval('(' + Store.func + ')')
        Object.defineProperty(Store.func, "name", { value: "You" });
        return Store.func;
    }
  }
  componentWillMount() {
    if (typeof Store.func === 'string')
      // eslint-disable-next-line
      Store.func = eval("(" + Store.func + ")");
    var newConfig = {
      ...config,
      botsQuantityPerGame: this.state.gameData.botsQuantities || config.botsQuantityPerGame,
      time: this.state.gameData.gameTime || config.time,
      scoreToWin: this.state.gameData.scoreToWin || config.scoreToWin
    }
    var result = tableResult([Store.func, level1, level2, level3], newConfig);
    this.setState({ presult: result.tableHtml });
    Store.tournamentScoreBeaten = result.score > this.state.gameData.tournamentScoreToWin ? true : false;
    setTimeout(() => {
      this.attachClickEvent();
    }, 1000);
  }
  render() {
    return (
      <div>
        {!Store.showGameSimulation ? <div><div style={{ background: 'white' }}>
          {
            <p dangerouslySetInnerHTML={{ __html: this.state.presult }} />

          }
          <div style={{ textAlign: 'right' }}>
            {Store.tournamentScoreBeaten && <button className="btn-smaller control-btn" onClick={(e) => {
              this.props.onCommit({ pyCode: this.store.editorPyCode });
            }}>Commit</button>}
            <button className="btn-smaller control-btn" onClick={(e) => {
              e.target.disabled = true;
              if (typeof Store.func === 'string')
                // eslint-disable-next-line
                Store.func = eval("(" + Store.func + ")");
              Object.defineProperty(Store.func, "name", { value: "You" });
              var newConfig = {
                ...config,
                botsQuantityPerGame: this.state.gameData.botsQuantities || config.botsQuantityPerGame,
                time: this.state.gameData.gameTime || config.time,
                scoreToWin: this.state.gameData.scoreToWin || config.scoreToWin
              }
              var result = tableResult([Store.func, level1, level2, level3], newConfig);
              this.setState({ presult: result.tableHtml });
              Store.tournamentScoreBeaten = result.score > this.state.gameData.tournamentScoreToWin ? true : false;
              setTimeout(() => {
                this.attachClickEvent();
              }, 1000);
              e.target.disabled = false;
            }}
            >RESIMULATE</button>
          </div>
        </div></div> : <div>
            <div className="gameHeader"><button
              onClick={() => {
                Store.showGameSimulation = false;
                setTimeout(() => {
                  this.attachClickEvent();
                }, 1000);
              }}
            >X</button><b>Match: {this.state.gameTitle}</b></div>
            <App gameData={this.state.gameData} player1Data={this.state.player1Data} playAsPlayer2={this.state.playAsPlayer2} store={Store} />
          </div>}
      </div>
    );
  }
}
export default observer(Tournament);