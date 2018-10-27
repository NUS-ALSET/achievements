/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Gnome1 from './Components/Characters/Gnome1';
import Gnome2 from './Components/Characters/Gnome2';
import Blonde from './Components/Characters/Blonde';
import Brunette from './Components/Characters/Brunette';
import Drone1 from './Components/Characters/Drone1';
import Drone2 from './Components/Characters/Drone2';
import Drone3 from './Components/Characters/Drone3';
import BlackCar from './Components/Characters/CarBlack';
import BlueCar from './Components/Characters/CarBlue';
import OrangeCar from './Components/Characters/CarOrange';
import WhiteCar from './Components/Characters/CarWhite';
import config from '../simulation/config.json';
import { observer } from 'mobx-react';

class Bot extends Component {
  static contextTypes = {
    loop: PropTypes.object,
    scale: PropTypes.number,
  };
  func = false;
  render() {
    switch (this.props.type) {
      case 'gnome1':
        return <div>
          <Gnome1
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
      case 'gnome2':
        return <div>
          <Gnome2
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
      case 'blonde':
        return <div>
          <Blonde
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
      case 'brunette':
        return <div>
          <Brunette
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
      case 'drone1':
        return <div>
          <Drone1
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
      case 'drone2':
        return <div>
          <Drone2
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
      case 'drone3':
        return <div>
          <Drone3
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
      case 'black-car':
        return <div>
          <BlackCar
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
       </div>;
      case 'blue-car':
        return <div>
          <BlueCar
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
      </div>;
      case 'orange-car':
        return <div>
          <OrangeCar
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
       </div>;
      case 'white-car':
        return <div>
          <WhiteCar
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
       </div>;
      default:
        return <div>
          <Gnome1
            store={this.props.store}
            scale={this.props.scale}
            size={config.playerSize}
            gameId={this.props.gameId}
            charId={this.props.charId}
          />
        </div>;
    }
  }
}
export default observer(Bot);