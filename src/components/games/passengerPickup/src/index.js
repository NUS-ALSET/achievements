import React from 'react';
import ReactDOM from 'react-dom';
import { Game } from './component';
import config from './simulation/config.json'

const defaultPlayer1Data = {
  pyCode: '',
  jsCode: ''
}

function getURLParameters(paramName) {
  const sURL = window.document.URL.toString();
  if (sURL.indexOf("?") > 0) {
    const arrParams = sURL.split("?");
    const arrURLParams = arrParams[1].split("&");
    const arrParamNames = new Array(arrURLParams.length);
    const arrParamValues = new Array(arrURLParams.length);
    for (let i = 0; i < arrURLParams.length; i++) {
      const sParam = arrURLParams[i].split("=");
      arrParamNames[i] = sParam[0];
      if (sParam[1] !== "")
        arrParamValues[i] = unescape(sParam[1]);
      else
        arrParamValues[i] = "No Value";
    }
    for (let i = 0; i < arrURLParams.length; i++) {
      if (arrParamNames[i] === paramName) {
        //alert("Parameter:" + arrParamValues[i]);
        return arrParamValues[i].split('#').join('');
      }
    }
    return '';
  }
}

function App() {
  const gameData = {
    playMode: getURLParameters('mode') === 'manual' ? 'manual code' : 'custom code',
    levelsToWin: Number(getURLParameters('level')) || 3,
    gameTime: Number(getURLParameters('gameTime')) || 10,
    botsQuantities: Number(getURLParameters('botsQuantities')) || 2,
    gameType: getURLParameters('gameType') || 'game',
    scoreToWin: Number(getURLParameters('scoreToWin')) || 20,
    tournamentScoreToWin: Number(getURLParameters('tournamentScoreToWin')) || 3,
    singleWindowGame: getURLParameters('singleWindowGame')==='true'
  }
  const playAsPlayer2 = getURLParameters('playAsPlayer2')==='true';
  const playerKeys = config[playAsPlayer2 ? 'player2Keys' : 'player1Keys'];

  return <div>
    <Game player1Data={defaultPlayer1Data} gameData={gameData} playAsPlayer2={playAsPlayer2} onCommit={() => { }} />
    <div className="info">
      {gameData.playMode === 'manual code' && <div>
        <p>Keys to play game manually : </p>
        <ol>
          {
            Object.keys(playerKeys).map(key => <li key={key}> {key.toUpperCase()}: {playerKeys[key]} </li>)
          }
        </ol>
      </div>}
      <p>URL params used to customize game are</p>
      <ol>
        <li>mode : 'manual' || 'custom'</li>
        <li>level : 1 || 2 || 3 [max 3]</li>
        <li>gameTime : 90</li>
        <li>botsQuantities : 3 [max {config.maxBotsQuantityPerGame}]</li>
        <li>gameType : 'game' || 'gameTournament'</li>
        <li>scoreToWin : 30</li>
        <li>tournamentScoreToWin : 3 || false [max = 6]</li>
        <li>playAsPlayer2 : true || false [default false]</li>
        <li>singleWindowGame : true || false [default false]</li>
      </ol>
      <p>Example :</p>
      <a href={`${window.location.origin}/?mode=custom&level=2&gameTime=200&botsQuantities=5&scoreToWin=35&playAsPlayer2=true&&gameType=gameTournament`}>{`${window.location.origin}/?mode=custom&level=2&gameTime=200&botsQuantities=5&scoreToWin=35&playAsPlayer2=true&&gameType=gameTournament`}</a>
    </div>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));
