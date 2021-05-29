import React from "react"
import Profile from "../Profile"
import { List, ListWrap, UILobbyWaiting, UIPage } from "../Component"
import Network from "../network"

export default class LobbyPage extends UIPage {

    state = {
        data: null
    }

    componentDidMount() {

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

        Network.instance.CmdFindMatch({ playername: Profile.instance.name })
        this.waitingMatch.toggle()
    }

    onCancelPress() {
        Network.instance.CmdCancelMatch()
    }

    render() {
        let default_profile = ['/res/profile_me.jpg', '/res/profile_vy.jpg']
        let avatar_default = '/res/avatar_default.png'
        let avatar = Profile.instance.name === 'vyvy' ? default_profile[1] : Profile.instance.name === 'khang' ? default_profile[0] : avatar_default
        
        let data = this.state.data || 'Đang tải'

        return <UIPage ref={c => this.page = c} >
            <div className='ui' style={{ top: 0, width: window.innerWidth, height: window.innerHeight, }}>
                <div style={{ background: 'rgba(225,225,225,0.8)', color: 'black' }}>
                    <div className='row' style={{ margin: '8px', fontSize: 20, }}>
                        <div className='row' style={{ alignItems: 'center' }} >
                            <img src={avatar} style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid mediumspringgreen' }} />
                            <div style={{ marginLeft: 5 }}>
                                <span style={{ fontSize: 16, fontWeight: 'bold' }} >{data && data.name}</span>
                                <span style={{ fontSize: 14 }}>Level 1</span>
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }} >
                            <span style={{ color: 'black' }}> {data && data.kcoin} KC</span>
                            <span style={{ color: 'black' }} > {data && data.kgold} KG</span>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, margin: 8, }} >
                    {/* <span>Bộ kĩ năng</span>
                    <ListWrap data={list_skill} render={(item, index) => <div key={index} style={{ width: 100, height: 125, margin: '8px 10px 10px 0' }}>
                        <img alt='hình' src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100, border: 0 }} />
                        <div style={{ marginLeft: 1 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, marginTop: 5 }} >{item.name}</span>
                        </div>
                    </div>} />

                    <span>Sưu tầm</span>
                    <List data={list_skill} render={(item, index) => <div key={index} style={{ marginTop: 8, }}>
                        <div style={{ flexDirection: "row" }}>
                            <img src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100 }} />
                            <div style={{ marginLeft: 5 }}>
                                <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                                <span style={{ fontSize: 13 }}> {`Yêu cầu Level ${item.require}. `}</span>
                                <span style={{ fontSize: 13 }}> {`${item.des} ${item.affect}s`}</span>
                            </div>
                        </div>
                    </div>} /> */}
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