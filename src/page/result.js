import React from "react";
import { UIPage, UITab } from "../Component";
import Network from "../network";

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
            accurate: data.accurate,
            exp: data.exp
        })

        // Network.instance.CmdGameEnd()
    }

    toggle() {
        this.page.toggle()
    }

    renderDetail() {
        return <div style={{ fontSize: 15, marginTop: 8, }} >
            <div className='row'>
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
    }

    renderOverview() {
        return <div>
            <div className='row'>
                <span>Thưởng</span>
                <span>{this.state.bonus}</span>
            </div>

            <div className='row'>
                <span>Kinh nghiệm</span>
                <span>{this.state.exp}</span>
            </div>
        </div>
    }

    render() {
        return <UIPage ref={c => this.page = c}>
            <div style={{ margin: 8 }} >
                <div style={{ marginTop: 10,  margin: '16px 0 24px 0', }} >
                    {/* <span style={{ fontSize: 40, textAlign: 'center', }} >{this.state.isWin ? 'Chiến thắng' : 'Thất bại'}</span> */}
                    <span style={{ fontSize: 40, textAlign: 'center' }} >Kết quả</span>
                </div>

                <UITab tabs={[
                    { name: 'Tổng quan', component: this.renderOverview() },
                    { name: 'Chi tiết', component: this.renderDetail() }]}
                />

                <div className='ui' style={{ alignSelf: 'center', bottom: 8 }} >
                    <button className='bt' onClick={this.props.onBackPress} >Quay về</button>
                </div>
            </div>
        </UIPage>
    }
}