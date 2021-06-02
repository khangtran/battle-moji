import React from "react";
import SocialLogin from "react-social-login";
import Network from "./network";
import Profile from "./Profile";

export class ListWrap extends React.Component {
    render() {
        return <div className='wrap' style={{}}>
            {this.props.data.map(((item, index) => this.props.render && this.props.render(item, index)))}
        </div>
    }
}

export class List extends React.Component {

    componentDidMount() {

        this.containerList.style.height = this.list.clientHeight - 16
    }

    scrollToBottom() {
        // this.containerList.scrollIntoView({ behavior: 'smooth', block: 'end' })
        this.containerList.scrollTop = this.containerList.scrollHeight
    }

    render() {
        return <div ref={c => this.list = c} className='list' style={{ flex: 1, ...this.props.style }} >
            <div ref={c => this.containerList = c} className='scroll' >
                {this.props.data.map((item, index) => this.props.render && this.props.render(item, index))}
            </div>
        </div>
    }
}

export class UIPage extends React.Component {

    state = {
        isShow: false
    }

    toggle() {
        this.setState({ isShow: !this.state.isShow })
    }

    render() {
        return <React.Fragment>
            {
                this.state.isShow &&
                this.props.children
            }
        </React.Fragment>
    }
}

export class UIPopup extends React.Component {

    state = {
        isShow: false
    }

    toggle() {
        this.setState({ isShow: !this.state.isShow })
    }

    render() {
        return <React.Fragment>
            {
                this.state.isShow &&
                <div className='ui bg-blur' style={{ width: '100%', height: '100%', }} >
                    <div className='' style={{ alignSelf: 'center', width: '100%', marginTop: '80%', height: '20%' }} >
                        <div style={{ backgroundColor: 'black', color: 'white', }} >
                            <span style={{ margin: 8, textAlign: 'center' }} >{this.props.text || 'Đang tải'}</span>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>

    }
}

export class UILobbyWaiting extends React.Component {

    state = {
        count: 0,
        isShow: false
    }

    countID = 0

    toggle() {

        if (this.state.isShow)
            clearInterval(this.countID)
        else
            this.counttime()

        this.setState({
            count: 0,
            isShow: !this.state.isShow
        })

        return this
    }

    counttime() {
        let { count, } = this.state
        count = 0

        this.countID = setInterval(() => {
            count += 1
            this.setState({
                count: count
            })
        }, 1000)
    }

    timeToString() {
        // 60s: 1p
        // 180s: 3p

        let ss = this.state.count % 60
        let mm = Math.floor(this.state.count / 60)
        ss = ss > 9 ? ss : `0${ss}`
        mm = mm > 9 ? mm : `0${mm}`
        return `${mm}:${ss}`
    }

    onCancelPress() {
        this.toggle()

        this.props.onCancelPress && this.props.onCancelPress()
    }

    render() {
        return <React.Fragment>
            {
                this.state.isShow &&
                <div className='ui bg-blur' style={{ width: '100%', height: '100%', }}>
                    <div style={{ alignSelf: 'center', marginTop: '65%', backgroundColor: 'white', width: '100%' }} >
                        <div style={{ margin: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 18 }}>Thời gian</span>
                            <span style={{ fontSize: 30, margin: '8px 0px' }} >{this.timeToString()}</span>
                            <button style={{ fontSize: 15, width: 100 }} onClick={() => this.onCancelPress()} >Hủy</button>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    }
}

export class UITab extends React.Component {

    state = {
        index: 0
    }

    prevIndex = 0

    componentDidMount() {
        DOMHelper.toggleClass('tab-header-0', 'active')
    }

    onPressTab(index) {
        if (index === this.prevIndex) return
        DOMHelper.toggleClass('tab-header-' + index, 'active')
        DOMHelper.toggleClass('tab-header-' + this.prevIndex, 'active')
        this.setState({ index: index })
        this.prevIndex = index
    }

    render() {
        let { tabs } = this.props
        return <div className={`uitab ${this.props.className}`} style={this.props.style}>
            <div className='row' style={{ justifyContent: 'normal', fontSize: 20 }} >
                {
                    tabs.map((item, index) => <div id={`tab-header-${index}`} className='tab-header' key={index} onClick={() => this.onPressTab(index)}>
                        <span style={{ margin: '0 8px 0px 8px' }}>{item.name}</span>
                    </div>
                    )
                }
            </div>
            <div className='tab-container' style={{ marginTop: 8, ...this.props.styleContainer }} >
                {
                    tabs[this.state.index].component
                }
            </div>
        </div>
    }
}

export class UIBubbleChat extends React.Component {
    render() {
        return <div>
            <span>[hiển thị tin nhắn mới ở đây]</span>
        </div>
    }
}

export class UIChat extends React.Component {

    state = {
        data: [],
        alert: '',

    }

    componentDidMount() {
        this.waitForConnection()
    }


    async waitForConnection() {
        this.alert('Đang kết nối máy chủ')
        let isConnected = await this.checkConnecting(10)
        if (isConnected) {
            this.alert('Kết nối chat chung')
        }
        else {
            this.alert('Không thể kết nối máy chủ')
            this.field.setAttribute('disabled', '')
        }
    }

    checkConnecting(timeout) {
        return new Promise((resolve, reject) => {
            let id;
            let time = 0
            id = setInterval(() => {
                if (Network.instance.isConnected) {
                    resolve(true)
                    clearInterval(id)

                    setTimeout(() => {
                        this.alertBar.style.flex = 'none'
                    }, 2000)
                }

                if (time >= timeout * 1000) {
                    resolve(false)
                    clearInterval(id)
                }
                time += 250
            }, 250)
        })
    }

    onKeyDown(key) {
        if (key === 'Enter') {
            let msg = { name: Profile.instance.name, playerid: Network.instance.networkid, content: this.field.value }
            this.addChat(msg)
            this.field.value = ''
            this.props.onSendMessage && this.props.onSendMessage(msg)
        }
    }

    addChat(msg) {
        let { data } = this.state
        data.push(msg)
        this.setState({ data: data }, () => {
            this.list.scrollToBottom()
        })
    }

    alert(msg) {
        this.setState({ alert: msg })
    }

    renderChat() {

        return <div style={{ flex: 1 }}>
            <div ref={c => this.alertBar = c} style={{ backgroundColor: 'black', }}>
                <span style={{ margin: 8, fontSize: 15, color: 'white' }}>{this.state.alert}</span>
            </div>
            <List ref={c => this.list = c} data={this.state.data} render={(item, index) => <div key={index}>
                <div className='row-tab chat-msg' style={{
                    margin: 8, fontSize: 15,
                    color: item.playerid !== Network.instance.networkid ? "black" : 'gray',
                    justifyContent: item.playerid !== Network.instance.networkid ? 'flex-start' : 'flex-end'
                }} >
                    <span style={{ display: item.playerid !== Network.instance.networkid ? 'flex' : 'none' }}>{item.name}:</span>
                    <span style={{ marginLeft: 2 }}>{item.content}</span>
                </div>
            </div>} />

            <input ref={c => this.field = c} placeholder='Nội dung tin nhắn'
                type='text' onFocus={() => this.field.value = ''} onKeyDown={(e) => this.onKeyDown(e.key)} />
        </div>
    }

    renderPlayRecent() {
        return <div style={{ flex: 1 }} >
            <span>[Tính năng đang phát triển]</span>
        </div>
    }

    closeChat() {
        DOMHelper.toggleClass('chat', 'appear')
    }

    render() {
        return <React.Fragment>
            <div>
                <UITab className='chat-tab'
                    styleContainer={{ height: Device.percentHeight(40), width: Device.percentWidth(50) }}
                    tabs={[{ name: 'Bạn bè', component: this.renderChat() },
                    { name: 'Gần đây', component: this.renderPlayRecent() }]} />
                <img className='ui' style={{ width: 25, height: 25, right: 8, top: 8 }} onClick={() => this.closeChat()}
                    src='https://cdn2.iconfinder.com/data/icons/font-awesome/1792/angle-down-512.png' />
            </div>


        </React.Fragment>
    }
}

export class DOMHelper {
    static toggleClass(id, className) {
        document.getElementById(id).classList.toggle(className)
    }

    static findByID(id) {
        return document.getElementById(id)
    }
}

Number.prototype.toX000 = function () {
    return this.toLocaleString()
}

export class Device {
    static vibrate(int) {
        window.navigator.vibrate && window.navigator.vibrate(int)
    }

    static get width() {
        return window.innerWidth
    }

    static get height() {
        return window.innerHeight
    }

    static percentWidth(value) {
        return value * this.width / 100
    }

    static percentHeight(value) {

        return value * this.height / 100
    }
}

class SocialButton extends React.Component {
    render() {
        const { children, triggerLogin, ...props } = this.props
        return (
            <button onClick={triggerLogin} {...props}>
                {children}
            </button>
        );
    }
}
export default SocialLogin(SocialButton)