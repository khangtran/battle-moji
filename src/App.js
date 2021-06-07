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
import NewsPage from "./page/news";
import { Device, DOMHelper } from "./Component";

export default class App extends React.Component {

  componentDidMount() {

    // PageManager.instance.addPage('news', this.news_page, true)

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

    Network.Client.setupEvent(async event => {
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
          Network.Client.CmdReady(GameCoreInstance.matchInfo.id)
          break

        case 'onGameStart':
          PageManager.instance.setTransition('game')
          break

        case 'onGameSync':
          GameCoreInstance.sync(event.data)
          break

        case 'pong':
          Network.Client.setNetSpeed(event.data)
          break
      }
    })

    this.requireInstallApp()
  }

  install_event = null
  requireInstallApp() {

    DOMHelper.findByID('require-install').style.display = 'none'

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => { console.log('Service Worker Registered'); });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()

      DOMHelper.findByID('require-install').style.display = 'flex'
      this.install_event = e
      console.log('Ready to Installable')
    })

    window.addEventListener('appinstalled', () => {

      DOMHelper.findByID('require-install').style.display = 'none'
      console.log('PWA was installed');
    });
  }

  onDownloadPress() {

    this.install_event.prompt()
    this.install_event.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.install_event = null;
    });
    console.log('install prompt')
  }

  backToLobby() {
    PageManager.instance.setTransition('lobby')
  }

  renderPopup() {
    return <div id='require-install' className='ui' style={{ width: Device.width, bottom: 0 }}>
      <div style={{ backgroundColor: 'whitesmoke' }}>
        <div className='row-tab' style={{ margin: 8 }} >
          <img src='/launcher_icon.png' style={{ width: 60, height: 60, borderRadius: 10 }} />
          <div style={{ fontSize: 15, marginLeft: 8 }}>
            <span>Battle Syaster</span>
            <span style={{ color: 'gray' }}>Phiên bản APLA TEST v0.1 build 17052021</span>
            <button id='bt-install' className='' style={{ padding: '5px 10px', borderRadius: '3px', width: '30%', border: 'none', backgroundColor: 'blue', color: 'white' }} onClick={() => this.onDownloadPress()}>Cài đặt</button>
          </div>
        </div>
      </div >
    </div >
  }

  render() {
    return (
      <div id="main">
        <NewsPage ref={c => this.news_page = c} />
        <LoginPage ref={c => this.login_page = c} />
        <LobbyPage ref={c => this.lobby_page = c} />
        <GamePage ref={c => this.game_page = c} />
        <ResultPage ref={c => this.result_page = c}
          onBackPress={() => this.backToLobby()}
        />

        <LoadingPage ref={c => this.loading_page = c} />

        <React.Fragment>
          {
            this.renderPopup()
          }
        </React.Fragment>
      </div>
    );
  }
}
