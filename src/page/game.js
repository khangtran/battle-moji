import React from "react";
import { UIPage } from "../Component";
import GameCoreInstance from "../gamecore";
import PageManager from "../PageManager";

export default class GamePage extends React.Component {

    isFirstLoad = false

    componentDidMount() {
        this.isFirstLoad = true

        GameCoreInstance.onEndGameDelegate = () => {
            PageManager.instance.setTransition('result')
                .show(this.gamedata)
        }
    }

    prepareBoard(data) {
        GameCoreInstance.loaded();
    }

    toggle() {
        this.page.toggle()
        if (this.isFirstLoad)
            this.prepareBoard()
    }

    get gamedata() {
        return GameCoreInstance.gamedata
    }

    render() {
        return <UIPage ref={c => this.page = c} >
            <div id="ui-game" style={{}} >
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
        </UIPage>
    }
}