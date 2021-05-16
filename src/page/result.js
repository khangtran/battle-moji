import React from "react";
import { UIPage } from "../Component";

export default class ResultPage extends React.Component {

    state = {
        isWin: false,
        combo: 10,
        bonus: 10,
        accurate: 70,
        exp: 0
    }

    setData(data) {
        this.setState({
            isWin: data.isWin,
            combo: data.combo,
            bonus: data.bonus,
            accurate: data.accurate
        })
    }

    toggle() {
        this.page.toggle()
    }

    render() {
        return <UIPage ref={c => this.page = c}>
            <div className='ui' style={{ backgroundColor: 'whitesmoke', top: '30%', left: '20%', width: 300, }} >
                <div style={{ margin: 8 }} >
                    <div style={{}} >
                        <span style={{ fontSize: 22, textAlign: 'center' }} >{this.state.isWin ? 'Chiến thắng' : 'Thất bại'}</span>
                    </div>
                    <div style={{ fontSize: 15, marginTop: 8 }} >
                        <div className='row' >
                            <span>Combo</span>
                            <span>{this.state.combo}</span>
                        </div>
                        <div className='row'>
                            <span>Chính xác</span>
                            <span>{this.state.accurate}%</span>
                        </div>

                        <div className='row'>
                            <span>Thưởng</span>
                            <span>{this.state.bonus}</span>
                        </div>

                        <div className='row'>
                            <span>Kinh nghiệm</span>
                            <span>{this.state.exp}</span>
                        </div>
                    </div>

                    <div className='row' style={{ marginTop: 12 }} >
                        <button className='bt' onClick={this.props.onBackPress} >Quay về</button>
                        {/* <button className='bt' onClick={() => this.props.onPlayPress && this.props.onPlayPress()} >Chơi tiếp</button> */}
                    </div>
                </div>
            </div >
        </UIPage>
    }
}