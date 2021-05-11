import React from "react";
import GameCoreInstance from "../game";

export default class GamePage extends React.Component {

    state = { isShow: false }

    show(bool) {
        this.setState({ isShow: bool })
    }

    componentDidMount() {
        GameCoreInstance.loaded();
    }


    get gamedata() {
        return GameCoreInstance.gamedata
    }

    setEvent(event, callback) {

        switch (event) {
            case 'endgame':
                GameCoreInstance.onEndGameDelegate = callback
        }
    }

    render() {
        return (<div id="ui-game" style={{ display: this.state.isShow ? 'flex' : 'none' }} >
            <canvas id="canvas" />

            <div className="ui score">
                <span id="lb-level">Level 1: 10</span>
                <span id="lb-score">Điểm 0</span>
                <span id="lb-mutil" />
            </div>

            <div className="ui time">
                <span id="lb-time">00:00</span>
            </div>

            <div className="ui detect">
                <span id="lb-detect">Nhận dạng ...</span>
            </div>
        </div>
        )
    }
}