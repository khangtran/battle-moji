import React from "react";
import { GameSprite } from "./GameScript";

export default class PlayerSkin extends React.Component {
    constructor() {
        this.skin = new GameSprite('', { x: 0, y: 0 }, { width: 20, height: 20 })

    }

    update() {

    }
}