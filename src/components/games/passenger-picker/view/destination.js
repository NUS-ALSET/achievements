import React, { Component } from 'react';
import img1 from '../assets/destination/PickupGreen.png';
import img2 from '../assets/destination/PickupViolet.png';
import Store from '../store';
import Sprite from './Components/Characters/Sprite';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import config from '../simulation/config.json';

class Destination extends Component {
    static contextTypes = {
        scale: PropTypes.number
    };
    getWrapperStyles(destination) {
        var targetX = destination.takeofX*this.context.scale;
        var targetY = destination.takeofY*this.context.scale;
        return {
            position: 'absolute',
            transform: `translate(${targetX}px, ${targetY}px)`,
            transformOrigin: 'left top',
            width: config.passengerSize*this.context.scale+'px',
            height: config.passengerSize*this.context.scale+'px'
        };
    }
    render() {
        return (
            <div>
                {Store.destination[this.props.gameId][0]!==null&&<div style={this.getWrapperStyles(Store.destination[this.props.gameId][0])}>
                    <Sprite
                        repeat={true}
                        tileWidth={102}
                        tileHeight={102}
                        src={img1}
                        ticksPerFrame={4}
                        state={0}
                        scale={(config.passengerSize/102)*this.context.scale}
                        steps={[7]}
                    />
                </div>}
                {Store.destination[this.props.gameId][1]!==null&&<div style={this.getWrapperStyles(Store.destination[this.props.gameId][1])}>
                    <Sprite
                        repeat={true}
                        tileWidth={102}
                        tileHeight={102}
                        src={img2}
                        ticksPerFrame={4}
                        state={0}
                        scale={(config.passengerSize/102)*this.context.scale}
                        steps={[7]}
                    />
                </div>}
            </div>
        );
    }
}
export default observer(Destination);