/* eslint-disable */
import React, { Fragment } from 'react';
import App from './view/App.js';
import Tournament from './simulation/tournament';
import Store from './store';


const Game = (props) => (
    <Fragment>
        {props.tournament && <Tournament />}
        <App
            {...props}
            store={Store}
        />
    </Fragment>
)

export { Game }


