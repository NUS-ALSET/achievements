/* eslint-disable */
import React , { Fragment }from 'react';
import App from './view/App.js';
import Tournament from './simulation/tournament';
import Store from './store';
import level1 from './simulation/level1';
import level2 from './simulation/level2';
import level3 from './simulation/level3';


const Game = (props) => (
    <Fragment>
        {props.tournament && <Tournament/>}
        <App
            level1={level1}
            level2={level2}
            level3={level3}
            store={Store}
            {...props}
        />
    </Fragment>
)

export  { Game }


