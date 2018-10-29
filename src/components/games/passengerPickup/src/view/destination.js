/* eslint-disable */
import React, { Component } from 'react';
import img1 from '../assets/destination/PickupGreen.png';
import img2 from '../assets/destination/PickupViolet.png';
import Sprite from './Components/Characters/Sprite';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import config from '../simulation/config.json';

class Destination extends Component {
  static contextTypes = {
    scale: PropTypes.number
  };
  getWrapperStyles(destination) {
    var targetX = destination.takeofX * this.context.scale;
    var targetY = destination.takeofY * this.context.scale;
    return {
      position: 'absolute',
      transform: `translate(${targetX}px, ${targetY}px)`,
      transformOrigin: 'left top',
      width: config.passengerSize * this.context.scale + 'px',
      height: config.passengerSize * this.context.scale + 'px'
    };
  }
  render() {
    return (
      <div>
        {this.props.store.destination[this.props.gameId].map((dest) => {
          if (dest !== null) {
            return <div key={dest.takeofX + "-" + dest.takeofY + "-" + dest.x + "-" + dest.x} style={this.getWrapperStyles(dest)}>
              <Sprite
                repeat={true}
                tileWidth={102}
                tileHeight={102}
                src={Math.random() > 0.5 ? img1 : img2}
                ticksPerFrame={4}
                state={0}
                scale={(config.passengerSize / 102) * this.context.scale}
                steps={[7]}
              />
            </div>
          }
          return false;
        })}
      </div>
    );
  }
}
export default observer(Destination);