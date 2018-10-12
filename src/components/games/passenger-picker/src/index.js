/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { Game } from './component';

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
      if (sParam[1] != "")
        arrParamValues[i] = unescape(sParam[1]);
      else
        arrParamValues[i] = "No Value";
    }
    for (let i = 0; i < arrURLParams.length; i++) {
      if (arrParamNames[i] == paramName) {
        //alert("Parameter:" + arrParamValues[i]);
        return arrParamValues[i];
      }
    }
    return '';
  }
}

function App() {
  const gameData = {
    playMode:  getURLParameters('mode') === 'manual' ? 'manual code' : 'custom code',
    levelsToWin: Number(getURLParameters('level')) || 3, 
    gameTime: Number(getURLParameters('gameTime')) || 10,
    botsQuantities: Number(getURLParameters('botsQuantities')) || 2,
    gameType: getURLParameters('gameType') || 'game',
    scoreToWin :Number(getURLParameters('scoreToWin')) || 20
  }
  return <div>
    <Game player1Data={defaultPlayer1Data} gameData={gameData} onCommit={()=>{}}  />
    <div className="info">
    <p>URL params used to customize game are</p>
    <ol>
      <li> mode : manual || custom</li>
      <li>level : 1 || 2 || 3 [max 3]</li>
      <li>gameTime : 90</li>
      <li>botsQuantities : 3 [max 8]</li>
      <li>gameType : game || gameTournament</li>
      <li>scoreToWin : 30</li>

    </ol>
    <p>Example :</p>
    <a href={`${window.location.origin}/?mode=manual&level=2&gameTime=200&botsQuantities=5&scoreToWin=35`}>{`${window.location.origin}/?mode=manual&level=2&gameTime=200&botsQuantities=5&scoreToWin=35`}</a>
  
    </div>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));