import React from "react"
import Profile from "../Profile"
import GameCoreInstance from "../gamecore"
import { List, ListWrap, UILobbyWaiting, UIPage } from "../Component"
import PageManager from "../PageManager"
import Network from "../network"

const list_skill = [{ name: 'Hàn băng', des: 'Đóng băng đối phương', type: 'time', affect: 3, isActive: true, require: 2, img: 'skill_6.png' },
{ name: 'Tê liệt', des: 'Gây choáng đối phương', type: 'time', affect: 2, isActive: true, require: 2, img: 'skill_2.png' },
{ name: 'Sock ', des: 'Gây mù đối phương', type: 'time', affect: 2, isActive: true, require: 2, img: 'skill_4.png' },
]

export default class LobbyPage extends UIPage {

    state = {
        data: null
    }

    componentDidMount() {

        // Network.instance.delegate('onMatched', msg => {
        //     this.waitingMatch.toggle()
        //     PageManager.instance.setTransition('loading')
        // })
    }

    toggle() {
        let { isShow } = this.page.state
        if (!isShow)
            this.loadData()

        this.page.toggle()
    }

    loadData() {
        let x = Profile.instance
        this.setState({ data: x })
        console.log('>> load profile', x)
    }

    onBtFindMatch() {

        Network.instance.findMatch({ playername: Profile.instance.name })
        this.waitingMatch.toggle()
    }

    onCancelPress() {
        Network.instance.cancelMatch()
    }

    render() {
        let data = this.state.data || 'Đang tải'
        return <UIPage ref={c => this.page = c} >
            <div className='ui' style={{ top: 0, width: window.innerWidth, height: window.innerHeight, }}>
                <div style={{ background: 'rgba(225,225,225,0.8)', color: 'black' }}>
                    <div className='row' style={{ margin: '8px', fontSize: 20, }}>
                        <div>
                            <span>{data && data.name}</span>
                            <span style={{ fontSize: 16 }}>Level 1</span>
                        </div>

                        <div style={{ textAlign: "right" }} >
                            <span style={{ color: 'red' }}> {data && data.kcoin} KC</span>
                            <span style={{ color: 'green' }} > {data && data.kgold} KG</span>
                        </div>
                    </div>
                </div>


                <div style={{ flex: 1, margin: 8, }} >
                    <span>Trang bị</span>
                    <ListWrap data={list_skill} render={(item, index) => <div key={index} style={{ width: 100, height: 125, margin: '8px 10px 10px 0' }}>
                        <img alt='hình' src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100, border: 0 }} />
                        <div style={{ marginLeft: 1 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, marginTop: 5 }} >{item.name}</span>
                        </div>
                    </div>} />

                    <span>Kĩ năng</span>
                    <List data={list_skill} render={(item, index) => <div key={index} style={{ marginTop: 8, }}>
                        <div style={{ flexDirection: "row" }}>
                            <img src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100 }} />
                            <div style={{ marginLeft: 5 }}>
                                <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                                <span style={{ fontSize: 13 }}> {`Yêu cầu Level ${item.require}. `}</span>
                                <span style={{ fontSize: 13 }}> {`${item.des} ${item.affect}s`}</span>
                            </div>
                        </div>
                    </div>} />
                </div>

                <div id="ui-lobby" className="row" style={{ width: '80%', alignSelf: "center", marginBottom: 12 }} >
                    <button id="bt-friend" className="bt">
                        Bạn bè
                    </button>
                    <button id="bt-play" className="bt" onClick={() => this.onBtFindMatch()}>
                        Tìm trận
                    </button>
                    <button id="bt-skill" className="bt">
                        Cửa hàng
                    </button>
                </div>

                <UILobbyWaiting ref={c => this.waitingMatch = c} onCancelPress={() => this.onCancelPress()} />
            </div>
        </UIPage>

    }
}