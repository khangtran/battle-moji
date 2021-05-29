import React from "react";
import SocialLogin from "react-social-login";

export class ListWrap extends React.Component {
    render() {
        return <div className='wrap' style={{}}>
            {this.props.data.map(((item, index) => this.props.render && this.props.render(item, index)))}
        </div>
    }
}

export class List extends React.Component {
    render() {
        return <div className='list'>
            {this.props.data.map((item, index) => this.props.render && this.props.render(item, index))}
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

export class Device {
    static vibrate(int) {
        window.navigator.vibrate && window.navigator.vibrate(int)
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
        return <div className='uitab'>
            <div className='row' style={{ justifyContent: 'normal', fontSize: 20 }} >
                {
                    tabs.map((item, index) => <div id={`tab-header-${index}`} className='tab-header' key={index} style={{ marginRight: index !== tabs.lenght - 1 ? 8 : 0 }} onClick={() => this.onPressTab(index)}>
                        <span>{item.name}</span>
                    </div>
                    )
                }
            </div>
            <div className='tab-container' style={{ marginTop: 8, }} >
                {
                    tabs[this.state.index].component
                }
            </div>
        </div>
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