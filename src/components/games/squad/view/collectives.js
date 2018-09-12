import React, { Component } from 'react';
import Store from '../store';
import img from '../assets/collective/trash1.png';
import squadConfig from '../simulation/config.json';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

class Collectives extends Component {
    static contextTypes = {
        scale: PropTypes.number
    };
    constructor() {
        super();
    }

    render(){
        return <div>{Store.collectives[this.props.gameId].map((collective, index) => {
            return <div
            key={index}
            style={{
                position: 'absolute',
                transform: 'translate(' + collective.x*this.context.scale + 'px, ' + collective.y*this.context.scale + 'px) translateZ(0)',
                transformOrigin: 'top left',
                width: squadConfig.collectiveSize*this.context.scale,
                height: squadConfig.collectiveSize*this.context.scale
            }}>
                <img
                    style={{ 'width': '100%', 'height': '100%' }}
                    src={img}
                />
            </div>;
        })}</div>;
    }
}
export default observer(Collectives);