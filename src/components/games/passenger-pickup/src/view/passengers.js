/* eslint-disable */
import React, { Component } from 'react';
import img from '../assets/passenger/passenger.png';
import squadConfig from '../simulation/config.json';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

class Passengers extends Component {
  static contextTypes = {
    scale: PropTypes.number
  };

  render() {
    return <div>{this.props.store.passengers[this.props.gameId].map((passenger, index) => {
      return <div
        key={index}
        style={{
          position: 'absolute',
          transform: 'translate(' + passenger.x * this.context.scale + 'px, ' + passenger.y * this.context.scale + 'px) translateZ(0)',
          transformOrigin: 'top left',
          width: squadConfig.passengerSize * this.context.scale,
          height: squadConfig.passengerSize * this.context.scale
        }}>
        <img
          alt={""}
          style={{ 'width': '100%', 'height': '100%' }}
          src={img}
        />
      </div>;
    })}</div>;
  }
}
export default observer(Passengers);