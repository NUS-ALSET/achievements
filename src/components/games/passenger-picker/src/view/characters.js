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
    var charactersTypeArr = ['drone1', 'drone2', 'drone3'];
  }
  render() {
    return <div>
      {this.props.store.position[this.props.gameId].map((pos,index)=>{
        if(index<this.props.store.botsQuantity)
          return <div key={index}><Character scale={this.context.scale} store={this.props.store} gameId={this.props.gameId} charId={index} type={'black-car'}></Character></div>
      })}
    </div>
  }
}
export default observer(Characters);