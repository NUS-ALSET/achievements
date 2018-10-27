import { extendObservable } from 'mobx';
import config from './simulation/config.json';
import { defaultJavascriptFunctionCode } from './view/Components/defaultCode';

class passengerStore {
  constructor() {
    let position = [new Array(config.maxBotsQuantityPerGame), new Array(config.maxBotsQuantityPerGame)];
    let destination = [new Array(config.maxBotsQuantityPerGame), new Array(config.maxBotsQuantityPerGame)];
    for (var i = 0; i < config.maxBotsQuantityPerGame; i++) {
      position[0][i] = config.player1StartingPoint;
      position[1][i] = config.player1StartingPoint;
      destination[0][i] = null;
      destination[1][i] = null;
    }
    extendObservable(this, {
      time: config.time,
      prevTime: Date.now(),
      position: position,
      botsQuantity: config.botsQuantityPerGame,
      direction: [['right', 'down'], ['right', 'down']],
      passengers: [[], []],
      destination: destination,
      score: [0, 0],
      mode: 'play',
      player1Func: undefined,
      player2Func: undefined,
      func: defaultJavascriptFunctionCode,
      needToRestartGame: false,
      editorMode: config.editorMode,
      editorPyCode: '',
      currentLevel: 1,
      showGameSimulation: false,
      tournamentScoreBeaten: false
    });
  }
  updatePosition(gameId, playerId, newPosition, offset) {
    if (Math.abs(this.position[gameId][playerId].x - newPosition.x) >= offset || Math.abs(this.position[gameId][playerId].y - newPosition.y) >= offset) {
      this.position[gameId][playerId] = newPosition;
    }
  }
  updatePassengers(gameId, passengersArr) {
    if (this.passengers[gameId].length !== passengersArr.length) {
      this.passengers[gameId] = passengersArr;
    }
  }
  updateDirection(gameId, playerId, newDirection) {
    var direction = 'right';
    if (newDirection.right)
      direction = 'right';
    else if (newDirection.left)
      direction = 'left';
    else if (newDirection.up)
      direction = 'up';
    else if (newDirection.down)
      direction = 'down';
    if (this.direction[gameId][playerId] !== direction) {
      this.direction[gameId][playerId] = direction;
    }
  }
  updateDestination(gameId, playerId, destination) {
    if (this.destination[gameId][playerId] !== destination) {
      this.destination[gameId][playerId] = destination;
    }
  }
  updateScore(gameId, score) {
    if (this.score[gameId] !== score) {

      this.score[gameId] = score;
    }
  }
}

export default new passengerStore();