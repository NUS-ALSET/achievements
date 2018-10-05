import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/App.js';
import Tournament from './simulation/tournament';
import Store from './store';
import level1 from './simulation/level1';
import level2 from './simulation/level2';
import level3 from './simulation/level3';

ReactDOM.render(<Tournament></Tournament>, document.getElementById('simulation'));
ReactDOM.render(<App level1={level1} level2={level2} level3={level3} store={Store}></App>, document.getElementById('root'));