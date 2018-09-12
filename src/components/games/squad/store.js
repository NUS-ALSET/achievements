import { observable, computed, extendObservable } from 'mobx';
import config from './simulation/config.json';
import {defaultJavascriptFunctionCode} from './view/Components/defaultCode';

class squadStore {
    constructor() {
        extendObservable(this, {
            time: config.time,
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
            collectives: [[], []],
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
    }
    updateCollectives(gameId, collectivesArr){
        if(this.collectives[gameId].length !== collectivesArr.length){
            this.collectives[gameId] = collectivesArr;
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
    updateScore(gameId, score){
        if(this.score[gameId]!==score){
            
            this.score[gameId]=score;
        }
    }
}

export default new squadStore();