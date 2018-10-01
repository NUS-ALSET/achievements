/* eslint-disable */
import React, { Component } from 'react';
import Sprite from './Sprite';
import { observer } from 'mobx-react';
import img from '../../../assets/sprites/brunette.png';

class Brunette extends Component {
  getAnimationState() {
    switch (this.props.direction) {
      case 'up':
        this.animState = 8;
        break;
      case 'down':
        this.animState = 10;
        break;
      case 'left':
        this.animState = 9;
        break;
      case 'right':
        this.animState = 11;
        break;
      default:
        this.animState = 8;
        break;
    }
  }
  getWrapperStyles() {
    this.getAnimationState();
    var targetX = this.props.position.x*this.props.scale;
    var targetY = this.props.position.y*this.props.scale;
    return {
      position: 'absolute',
      transform: `translate(${targetX}px, ${targetY}px)`,
      transformOrigin: 'left top'
    };
  }
  render() {
    return (
      <div id={'character'} style={this.getWrapperStyles()}>
        <Sprite
          repeat={true}
          tileWidth={64}
          tileHeight={64}
          src={img}
          ticksPerFrame={4}
          state={this.animState}
          scale={(this.props.size/64)*this.props.scale}
          steps={[6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 5, 5, 5, 5, 12, 12, 12, 12, 5]}
        />
      </div>
    );
  }
}
export default observer(Brunette);