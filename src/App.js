import React from "react";
import "./style.css";
import LobbyPage from "./page/lobby";
import GamePage from "./page/game";
import ResultPage from "./page/result";

export default class App extends React.Component {

  componentDidMount() {
    this.ui_lobby.findMatchDelegate = () => {
      this.ui_game.show(true)
    }

    this.ui_game.onEndGame = () => {
      this.ui_game.show(false)
      this.ui_result.show(true)
    }
  }

  render() {
    return (
      <div id="main">

        <GamePage ref={c => this.ui_game = c} />
        <LobbyPage ref={c => this.ui_lobby = c} />
        <ResultPage ref={c => this.ui_result = c} />
      </div>
    );
  }
}
