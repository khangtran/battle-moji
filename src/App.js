import React from "react";
import "./style.css";
import GameCore from "./game";

export default class App extends React.Component {
  componentDidMount() {
    GameCore.loaded();
  }

  render() {
    return (
      <div id="main">
        <div id="ui-game">
          <canvas id="canvas" />

          <div className="ui score">
            <span id="lb-level">Level 1: 10</span>
            <br />
            <span id="lb-score">Điểm 0</span>
            <br />
            <span id="lb-mutil" />
          </div>

          <div className="ui detect">
            <span id="lb-detect">Nhận dạng ...</span>
          </div>
        </div>

        <div id="ui-lobby" className="ui lobby">
          <button id="bt-play" className="bt-play">
            Tìm trận
          </button>
        </div>
      </div>
    );
  }
}
