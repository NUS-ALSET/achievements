/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Character from './character';
import { observer } from 'mobx-react';

class Characters extends Component {
  static contextTypes = {
    loop: PropTypes.object,
    scale: PropTypes.number,
  };
  constructor(props) {
    super(props);
    //this.charactersTypeArr = ['black-car', 'blue-car', 'orange-car', 'white-car'];
    this.charactersTypeArr = ['orange-car'];
  }
  render() {
    return <div>
      {this.props.store.position[this.props.gameId].map((pos,index)=>{
        if(index<this.props.store.botsQuantity)
          return <div key={index}><Character scale={this.context.scale} store={this.props.store} gameId={this.props.gameId} charId={index} type={this.charactersTypeArr[Math.floor(Math.random()*this.charactersTypeArr.length)]}></Character></div>
        return false;
      })}
    </div>
  }
}
export default observer(Characters);