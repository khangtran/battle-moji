import React from "react"
import Profile from "../Profile"
import GameCoreInstance from "../game"
import { List, ListWrap } from "../Component"

const list_skill = [{ name: 'Hàn băng', des: 'Đóng băng đối phương', type: 'time', affect: 3, isActive: true, require: 2, img: 'skill_6.png' },
{ name: 'Tê liệt', des: 'Gây choáng đối phương', type: 'time', affect: 2, isActive: true, require: 2, img: 'skill_2.png' },
{ name: 'Sock ', des: 'Gây mù đối phương', type: 'time', affect: 2, isActive: true, require: 2, img: 'skill_4.png' },
]


class UIFindMatch extends React.Component {

    state = {
        isShow: false
    }

    show(bool) {
        this.setState({
            isShow: bool
        })
        return this
    }

    onMatched(cb) {
        setTimeout(() => {
            this.show(false)
            cb()
        }, 2000)
    }

    render() {
        return <div className='ui' style={{ width: '100%', height: '100%', backgroundColor: 'rgb(128, 128, 128, 0.5)', display: this.state.isShow ? 'flex' : 'none' }}>
            <div style={{ alignSelf: 'center', marginTop: '50%', backgroundColor: 'white', width: '100%' }} >
                <div style={{ margin: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 18 }}>Thời gian</span>
                    <span style={{ fontSize: 30, margin: '8px 0px' }} >00:00</span>
                    <button style={{ fontSize: 15, width: 100 }}>Hủy</button>
                </div>
            </div>
        </div>
    }
}

export default class LobbyPage extends React.Component {

    state = {
        isShow: true,
        data: null
    }

    componentDidMount() {
        let x = Profile.loadData()
        this.setState({ data: x })

    }

    onBtFindMatch() {

        this.findMatch.show(true)
            .onMatched(() => {

                GameCoreInstance.startGame()
                this.show(false)

                this.onNotifyMatched && this.onNotifyMatched()
            })

        console.log('setup button findmatch lobby')
    }

    show(bool) {
        this.setState({ isShow: bool })
    }

    render() {
        let data = this.state.data || 'Đang tải'
        return (
            <div className='ui' style={{ top: 0, width: window.innerWidth, height: window.innerHeight, display: this.state.isShow ? 'flex' : "none" }}>
                <div className='row' style={{ margin: '8px', fontSize: 18 }}>
                    <div>
                        <span>{data && data.name}</span>
                        <span style={{ fontSize: 16 }}>Level 1</span>
                    </div>

                    <div style={{ textAlign: "right" }} >
                        <span> {data && data.kcoin} KC</span>
                        <span> {data && data.kgold} KG</span>
                    </div>
                </div>

                <div style={{ flex: 0.95, margin: 8, }} >
                    <span>Trang bị</span>
                    <ListWrap data={list_skill} render={(item, index) => <div key={index} style={{ width: 100, height: 125, margin: '8px 10px 10px 0' }}>
                        <img alt='hình' src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100, border: 0 }} />
                        <div style={{ marginLeft: 1 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, marginTop: 5 }} >{item.name}</span>
                        </div>
                    </div>} />

                    <span>Kĩ năng</span>
                    <List data={list_skill} render={(item, index) => <div key={index} style={{ marginTop: 8 }}>
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

                <div id="ui-lobby" className="row" style={{ width: '80%', alignSelf: "center" }} >
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

                <UIFindMatch ref={c => this.findMatch = c} />

            </div>
        )
    }
}