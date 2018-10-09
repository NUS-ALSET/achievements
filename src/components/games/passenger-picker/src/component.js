/* eslint-disable */
import React, { Fragment } from 'react';
import App from './view/App.js';
import Tournament from './simulation/tournament';
import Store from './store';
// import level1 from './simulation/level1';
// import level2 from './simulation/level2';
// import level3 from './simulation/level3';
import { agentJavascriptFunctionCode, agentPythonCodeFunction } from './view/Components/defaultAgent';

const defaultPlayer2Data = {
    pyCode: agentPythonCodeFunction,
    jsCode: agentJavascriptFunctionCode
}

const Game = (props) => (
    <Fragment>
        {props.tournament && <Tournament />}
        <App
            store={Store}
            {...props}
            player2Data = {props.player2Data || defaultPlayer2Data}
        />
    </Fragment>
)

export { Game }


