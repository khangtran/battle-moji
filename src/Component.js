import React from "react";

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