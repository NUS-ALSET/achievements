/* eslint-disable */
import React, { Fragment } from 'react';
import App from './view/App.js';
import Tournament from './simulation/tournament';
import Store from './store';

import './style.css';


const Game = (props) => (
  <Fragment>
    {props.gameData.gameType === 'gameTournament' && <Tournament {...props} />}
    {props.gameData.gameType !== 'gameTournament' && <App
      {...props}
      store={Store}
    />}
  </Fragment>
)

export { Game }
