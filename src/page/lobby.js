import React from "react"
import Profile from "../Profile"
import { DOMHelper, List, ListWrap, UIChat, UILobbyWaiting, UIPage } from "../Component"
import Network from "../network"
import { Mission } from "../Mission"



var MissionDaily = []
export default class LobbyPage extends UIPage {

    state = {
        data: null
    }

    componentDidMount() {

        let missa = new Mission('Nhiệm vụ ngày', 'Hoàn thành 5 trận', 5)
        let missb = new Mission('Nhiệm vụ ngày', 'Thắng 3 trận', 3)
        let missc = new Mission('Nhiệm vụ ngày', 'Tiêu diệt 30 ký tự', 30)

        MissionDaily = [missa, missb, missc]
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

        Network.Client.CmdFindMatch({ playername: Profile.instance.name })
        this.waitingMatch.toggle()
    }

    onCancelPress() {
        Network.Client.CmdCancelMatch()
    }

    onBtnVIPAccount() {
        console.log('>> buy vip 1 day')
    }

    onReceiveMessage(msg) {
        this.chat.addChat(msg)
    }

    onSendMessage(msg) {
        Network.Client.CmdSendMessage(msg)
    }

    onPressFriend() {
        DOMHelper.toggleClass('chat', 'appear')
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

                    <div className='ui' style={{ right: 8, border: '1px solid lightgray', }} onClick={() => this.onBtnVIPAccount()}>
                        <div className='' style={{ margin: '8px', }}>
                            <span>Tài khoản VIP</span>
                            <span>+50% exp</span>
                            <span>+50% kcoin</span>

                            <div style={{ borderTop: '1px solid rgb(0, 195, 255)', marginTop: 8, paddingTop: 4 }} >
                                <span>Ưu đãi 50.000đ</span>
                            </div>
                        </div>
                    </div>

                    <div className='ui' style={{ top: '30%', right: 8, border: '1px solid lightgray', }} onClick={() => this.onBtnVIPAccount()}>
                        <div className='box' >
                            <span>Nhiệm vụ ngày</span>
                            <div className='line' />
                            {MissionDaily.map((item, index) => <span key={index} style={{}} >{item.toString()}</span>)}
                        </div>
                    </div>

                    <div className='ui chat' id='chat' style={{ left: 8, }} >
                        <UIChat ref={c => this.chat = c}
                            onSendMessage={(msg) => this.onSendMessage(msg)} />
                    </div>

                </div>

                <div id="ui-lobby" className="row" style={{ width: '80%', alignSelf: "center", marginBottom: 12 }} >
                    <button id="bt-friend" className="bt" onClick={() => this.onPressFriend()}>
                        Bạn bè
                    </button>
                    <button id="bt-play" className="bt" onClick={() => this.onBtFindMatch()}>
                        Tìm trận
                    </button>

                </div>

                <UILobbyWaiting ref={c => this.waitingMatch = c} onCancelPress={() => this.onCancelPress()} />
            </div>
        </UIPage>

    }
}