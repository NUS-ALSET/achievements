import React, { Component } from 'react';
import Sprite from './Sprite';
import { observer } from 'mobx-react';
import img from '../../../assets/sprites/white-car-sprite.png';

class WhiteCar extends Component {
  getAnimationState() {
    switch (this.props.direction) {
      case 'up':
        this.animState = 0;
        break;
      case 'down':
        this.animState = 2;
        break;
      case 'left':
        this.animState = 3;
        break;
      case 'right':
        this.animState = 1;
        break;
      default:
        this.animState = 0;
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
      transformOrigin: 'left top',
      width:'20px',
      height:'20px'
    };
  }
  render() {
    return (
      <div id={'character'} style={this.getWrapperStyles()}>
        <Sprite
          repeat={true}
          tileWidth={100}
          tileHeight={100}
          src={img}
          ticksPerFrame={4}
          state={this.animState}
          scale={(this.props.size/100)*this.props.scale}
          steps={[0, 0, 0, 0]}
        />
      </div>
    );
  }
}
export default observer(WhiteCar);