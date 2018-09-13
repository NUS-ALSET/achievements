/* eslint-disable */
import { observable, computed, extendObservable } from 'mobx';
import config from './simulation/config.json';
import {defaultJavascriptFunctionCode} from './view/Components/defaultCode';

class passengerStore {
    constructor() {
        extendObservable(this, {
            time: config.time,
            scoreToWin : config.scoreToWin,
            prevTime: Date.now(),
            position: [
                [
                    config.player1StartingPoint,
                    config.player2StartingPoint
                ],
                [
                    config.player1StartingPoint,
                    config.player2StartingPoint
                ]
            ],
            direction: [['right','down'], ['right','down']],
            passengers: [[], []],
            destination: [[null, null], [null, null]],
            score: [0, 0],
            mode: 'play',
            player1Func: undefined,
            player2Func: undefined,
            func: defaultJavascriptFunctionCode,
            needToRestartGame: false,
            player1ControlSelected: "level3",
            player2ControlSelected:"manual control"
        });
    }
    updatePosition(gameId, playerId, newPosition, offset){
        if(Math.abs(this.position[gameId][playerId].x - newPosition.x) >= offset || Math.abs(this.position[gameId][playerId].y - newPosition.y) >= offset){
            this.position[gameId][playerId] = newPosition;
        }
        //this.position[gameId][playerId] = newPosition;
    }
    updatePassengers(gameId, passengersArr){
        if(this.passengers[gameId].length !== passengersArr.length){
            this.passengers[gameId] = passengersArr;
        }
    }
    updateDirection(gameId, playerId, newDirection){
        if(newDirection.right)
            var direction = 'right';
        else if(newDirection.left)
            var direction = 'left';
        else if(newDirection.up)
            var direction = 'up';
        else if(newDirection.down)
            var direction = 'down';
        
        
        if(this.direction[gameId][playerId]!=direction){
            this.direction[gameId][playerId]=direction;
        }
    }
    updateDestination(gameId, playerId, destination){
        if(this.destination[gameId][playerId]!==destination){
            this.destination[gameId][playerId]=destination;
        }
    }
    updateScore(gameId, score){
        if(this.score[gameId]!==score){
            
            this.score[gameId]=score;
        }
    }
}

export default new passengerStore();