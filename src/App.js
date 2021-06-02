import React from "react";
import "./style.css";
import LobbyPage from "./page/lobby";
import GamePage from "./page/game";
import ResultPage from "./page/result";
import LoadingPage from "./page/loading";
import LoginPage from "./page/login";
import PageManager from "./PageManager";
import Network from "./network";
import GameCoreInstance from "./gamecore";

export default class App extends React.Component {

  componentDidMount() {

    PageManager.instance.addPage('login', this.login_page, true)
    PageManager.instance.addPage('lobby', this.lobby_page, false)
    PageManager.instance.addPage('loading', this.loading_page)
    PageManager.instance.addPage('game', this.game_page, false)
    PageManager.instance.addPage('result', this.result_page)

    PageManager.instance.addTransition('login', 'lobby')
    PageManager.instance.addTransition('lobby', 'loading')
    PageManager.instance.addTransition('loading', 'game')
    PageManager.instance.addTransition('game', 'result')
    PageManager.instance.addTransition('result', 'lobby')

    Network.instance.setupEvent(async event => {
      console.log(`[network] ${event.name} `, event.data)

      switch (event.name) {
        case 'connected':

          setTimeout(() => {
            PageManager.instance.setTransition('lobby')
          }, 250)
          break

        case 'onReceiveMsg':
          this.lobby_page.onReceiveMessage(event.data)
          console.log('receive msg')
          break

        case 'onMatched':
          this.lobby_page.waitingMatch.toggle()
          PageManager.instance.setTransition('loading')
            .setData(event.data.players)
          GameCoreInstance.setMatchInfo(event.data)
          break

        case 'onGameLoad':
          let gameData = JSON.parse(event.data)
          await this.game_page.prepareBoard(gameData)
          // Network.instance.ready(GameCoreInstance.matchInfo.id)
          break

        case 'onGameStart':
          PageManager.instance.setTransition('game')
          break

        case 'onGameSync':
          GameCoreInstance.sync(event.data)
          break
      }
    })

    console.log('PageManagerList', PageManager.instance.list)
  }

  backToLobby() {
    PageManager.instance.setTransition('lobby')
  }

  render() {
    return (
      <div id="main">

        <LoginPage ref={c => this.login_page = c} />
        <LobbyPage ref={c => this.lobby_page = c} />
        <GamePage ref={c => this.game_page = c} />
        <ResultPage ref={c => this.result_page = c}
          onBackPress={() => this.backToLobby()}
        />

        <LoadingPage ref={c => this.loading_page = c} />
      </div>
    );
  }
}
