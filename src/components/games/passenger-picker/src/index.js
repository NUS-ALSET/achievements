import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/App.js';
import Tournament from './simulation/tournament';
import Store from './store';

ReactDOM.render(<Tournament></Tournament>, document.getElementById('simulation'));
ReactDOM.render(<App store={Store}></App>, document.getElementById('root'));