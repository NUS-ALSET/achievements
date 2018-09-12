import React, { Component } from 'react';
import { TileMap } from 'react-game-kit';
import img from '../assets/tiles/grass.jpg'

export default class Tile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <TileMap
                    style={{ top: 0, left: 0 }}
                    src={img}
                    rows={50}
                    columns={50}
                    tileSize={50}
                    layers={[[1]]}
                />
            </div>
        );
    }
}