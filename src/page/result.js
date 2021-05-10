import React from "react";
import GameCoreInstance from "../game";

export default class ResultPage extends React.Component {

    state = {
        isShow: false,
        isWin: false,
        combo: 10,
        bonus: 10,
        accurate: 70,
    }

    show(bool) {
        this.setState({
            isShow: bool
        })
    }

    render() {
        return <div className='ui' style={{ top: '50%', left: '45%', display: this.state.isShow ? 'flex' : 'none' }} >
            <span style={{ fontSize: 18 }} >{this.state.isWin ? 'Chiến thắng' : 'Thất bại'}</span>
            <div>
                <div className='row' >
                    <span>Combo</span>
                    <span>{this.state.combo}</span>
                </div>
                <div className='row'>
                    <span>Thưởng</span>
                    <span>{this.state.bonus}</span>
                </div>

                <div className='row'>
                    <span>Chính xác</span>
                    <span>{this.state.accurate}</span>
                </div>
            </div>

            <div className='row' >
                <button onClick={() => this.props.onBackPress && this.onBackPress()} >Quay lại</button>
                <button onClick={() => this.props.onPlayPress && this.props.onPlayPress()} >Chơi tiếp</button>
            </div>
        </div >
    }
}