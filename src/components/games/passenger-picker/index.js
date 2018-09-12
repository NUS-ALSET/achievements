import React , { Fragment }from 'react';
import App from './view/App.js';
import Tournament from './simulation/tournament';

const Game = (props) =>{
  return (
    <Fragment>
      <Tournament/>
    < App {...props}/>
    </Fragment>
  )
}

export  { Game }